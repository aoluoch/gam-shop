import { Heart, Users, BookOpen, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/routes'
import gamLogo from '@/assets/gamlogo.png'

const values = [
  {
    icon: BookOpen,
    title: 'Faith-Centered',
    description: 'Everything we do is rooted in our Christian faith and the desire to spread the Gospel through quality products.',
  },
  {
    icon: Heart,
    title: 'Quality & Care',
    description: 'We carefully curate each product to ensure it meets our high standards and serves our community well.',
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'We believe in building a strong community of believers who support and encourage one another.',
  },
  {
    icon: Target,
    title: 'Purpose-Driven',
    description: 'Every purchase supports our ministry and helps us continue our mission of spreading faith and hope.',
  },
]


export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 md:mb-6">
              <img 
                src={gamLogo} 
                alt="GAM Shop" 
                className="h-16 sm:h-20 md:h-24 w-auto"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 md:mb-6">
              About <span className="text-primary">GAM Shop</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
              GAM Shop is the official store of GAM Ministry, dedicated to providing quality Christian 
              books, apparel, and accessories that inspire faith and spread the message of hope. 
              Every purchase you make supports our mission to reach more communities with the Gospel.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                At GAM Ministry, we are committed to transforming lives through the power of faith. 
                Our shop serves as a platform to share resources that edify, educate, and encourage 
                believers in their spiritual journey.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We believe that faith should be accessible to everyone. That's why we offer a carefully 
                curated selection of books by renowned Christian authors, comfortable apparel that 
                allows you to wear your faith proudly, and accessories that serve as daily reminders 
                of God's love and promises.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                100% of our proceeds go directly to supporting GAM Ministry's outreach programs, 
                community initiatives, and charitable works across Kenya and beyond.
              </p>
            </div>
            <div className="bg-primary/5 rounded-2xl p-8">
              <blockquote className="text-xl italic text-foreground leading-relaxed">
                "And let us not grow weary of doing good, for in due season we will reap, 
                if we do not give up."
              </blockquote>
              <p className="text-primary font-semibold mt-4">— Galatians 6:9</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core values guide everything we do and shape how we serve our community.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Shop CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Support Our Ministry</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Every purchase from GAM Shop directly supports our ministry's work in communities 
            across Kenya. Browse our collection and find something that speaks to your faith.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to={ROUTES.SHOP}>Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
