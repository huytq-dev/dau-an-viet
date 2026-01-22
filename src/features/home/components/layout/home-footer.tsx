export default function HomeFooter() {
    return (
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-accent font-bold text-lg">🎮 ESCAPE ROOM</p>
              <p className="text-sm text-muted-foreground">Trải nghiệm giải đố tuyệt vời tại Đà Nẵng</p>
            </div>
  
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                Facebook
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                Instagram
              </a>
              <a href="#" className="text-muted-foreground hover:text-accent transition">
                Contact
              </a>
            </div>
          </div>
  
          <div className="border-t border-border mt-8 pt-6">
            <p className="text-center text-sm text-muted-foreground">© 2026 Escape Room Danang. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
  