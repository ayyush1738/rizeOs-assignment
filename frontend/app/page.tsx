import NavbarDemo  from '@/components/layout/Navbar';
import Hero  from '@/components/layout/Home';

export default function Home() {
  return (
    <div className="min-h-screen bg-purple-100">
      <NavbarDemo />
      <Hero />
    </div>
  );
}
