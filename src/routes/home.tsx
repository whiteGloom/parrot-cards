import { createFileRoute } from '@tanstack/react-router';
import { Header } from '../widgets/header.tsx';

export const Route = createFileRoute('/home')({
  component: Home,
});

function Home() {
  return (
    <div>
      <Header />
      <p>home</p>
    </div>
  );
}
