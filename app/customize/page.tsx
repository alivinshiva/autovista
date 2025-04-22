import CarCustomizer from "@/components/car-customizer"

export default function CustomizePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AutoVista Customizer</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <a href="/" className="hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="/gallery" className="hover:text-primary">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  About
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <div className="flex-grow container mx-auto p-4">
        <CarCustomizer />
      </div>

      <footer className="border-t p-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 AutoVista. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}

