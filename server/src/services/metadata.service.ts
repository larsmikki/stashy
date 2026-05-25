import exifr from 'exifr';
import { getDb } from '../db/connection.js';

export interface ExtractedMetadata {
  camera_make: string | null;
  camera_model: string | null;
  lens: string | null;
  width: number | null;
  height: number | null;
  orientation: number | null;
  iso: number | null;
  focal_length: number | null;
  f_number: number | null;
  exposure_time: number | null;
  gps_lat: number | null;
  gps_lon: number | null;
}

function toNum(v: unknown): number | null {
  if (typeof v === 'number' && isFinite(v)) return v;
  return null;
}

function toStr(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const trimmed = v.trim();
  return trimmed.length ? trimmed : null;
}

// Extract EXIF for a single image. Returns null for unsupported files or
// when no metadata could be read — both are fine, we just don't store a row.
export async function extractImageMetadata(filePath: string): Promise<ExtractedMetadata | null> {
  let exif: Record<string, unknown> | undefined;
  try {
    exif = await exifr.parse(filePath, [
      'Make', 'Model', 'LensModel', 'LensMake',
      'ExifImageWidth', 'ExifImageHeight', 'ImageWidth', 'ImageHeight',
      'Orientation', 'ISO', 'FocalLength', 'FNumber', 'ExposureTime',
      'latitude', 'longitude', 'GPSLatitude', 'GPSLongitude',
    ]) as Record<string, unknown> | undefined;
  } catch {
    return null;
  }
  if (!exif) return null;

  return {
    camera_make: toStr(exif.Make),
    camera_model: toStr(exif.Model),
    lens: toStr(exif.LensModel) ?? toStr(exif.LensMake),
    width: toNum(exif.ExifImageWidth) ?? toNum(exif.ImageWidth),
    height: toNum(exif.ExifImageHeight) ?? toNum(exif.ImageHeight),
    orientation: toNum(exif.Orientation),
    iso: toNum(exif.ISO),
    focal_length: toNum(exif.FocalLength),
    f_number: toNum(exif.FNumber),
    exposure_time: toNum(exif.ExposureTime),
    gps_lat: toNum(exif.latitude),
    gps_lon: toNum(exif.longitude),
  };
}

export function upsertMetadata(mediaId: number, meta: ExtractedMetadata): void {
  const db = getDb();
  db.raw
    .prepare(
      `INSERT INTO media_metadata
         (media_id, camera_make, camera_model, lens, width, height,
          orientation, iso, focal_length, f_number, exposure_time, gps_lat, gps_lon)
       VALUES (@mediaId, @cameraMake, @cameraModel, @lens, @width, @height,
               @orientation, @iso, @focalLength, @fNumber, @exposureTime, @gpsLat, @gpsLon)
       ON CONFLICT(media_id) DO UPDATE SET
         camera_make = excluded.camera_make,
         camera_model = excluded.camera_model,
         lens = excluded.lens,
         width = excluded.width,
         height = excluded.height,
         orientation = excluded.orientation,
         iso = excluded.iso,
         focal_length = excluded.focal_length,
         f_number = excluded.f_number,
         exposure_time = excluded.exposure_time,
         gps_lat = excluded.gps_lat,
         gps_lon = excluded.gps_lon`,
    )
    .run({
      mediaId,
      cameraMake: meta.camera_make,
      cameraModel: meta.camera_model,
      lens: meta.lens,
      width: meta.width,
      height: meta.height,
      orientation: meta.orientation,
      iso: meta.iso,
      focalLength: meta.focal_length,
      fNumber: meta.f_number,
      exposureTime: meta.exposure_time,
      gpsLat: meta.gps_lat,
      gpsLon: meta.gps_lon,
    });
}

export function getMetadata(mediaId: number): ExtractedMetadata | null {
  const db = getDb();
  const result = db.exec(
    `SELECT camera_make, camera_model, lens, width, height,
            orientation, iso, focal_length, f_number, exposure_time, gps_lat, gps_lon
     FROM media_metadata WHERE media_id = $id`,
    { $id: mediaId },
  );
  if (!result.length || !result[0].values.length) return null;
  const r = result[0].values[0];
  return {
    camera_make: (r[0] as string | null) ?? null,
    camera_model: (r[1] as string | null) ?? null,
    lens: (r[2] as string | null) ?? null,
    width: (r[3] as number | null) ?? null,
    height: (r[4] as number | null) ?? null,
    orientation: (r[5] as number | null) ?? null,
    iso: (r[6] as number | null) ?? null,
    focal_length: (r[7] as number | null) ?? null,
    f_number: (r[8] as number | null) ?? null,
    exposure_time: (r[9] as number | null) ?? null,
    gps_lat: (r[10] as number | null) ?? null,
    gps_lon: (r[11] as number | null) ?? null,
  };
}
