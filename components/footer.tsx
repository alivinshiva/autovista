import { Car } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Car className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">AutoVista</span>
          </div>
          {/* Removed Privacy, Terms, and Contact Us links */}
          {/* <div className="flex space-x-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a>
          </div> */}
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground">© 2025 AutoVista. All rights reserved.</div>
      </div>
    </footer>
  );
}