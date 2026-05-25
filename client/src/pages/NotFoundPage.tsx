import { useNavigate } from 'react-router-dom';
import { Button, Surface } from '@/components/ui';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto py-16 text-center">
      <Surface className="p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-text mb-1">Page not found</h1>
        <p className="text-sm text-text2 mb-6">That page does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go home
        </Button>
      </Surface>
    </div>
  );
}
