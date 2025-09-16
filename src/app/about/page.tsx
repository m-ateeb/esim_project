import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Globe, Users, Award, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { AuthHeader } from "@/src/components/auth-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
              Connecting the World,
              <span className="text-primary block">One eSIM at a Time</span>
            </h1>
            <p className="text-xl text-muted-foreground text-pretty">
              We're on a mission to make global connectivity accessible, affordable, and instant for everyone. Founded
              by travelers, built for explorers.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-balance">Our Mission</h2>
                <p className="text-lg text-muted-foreground text-pretty">
                  To eliminate the barriers of global communication by providing instant, reliable, and affordable
                  connectivity solutions that empower people to stay connected wherever their journey takes them.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Global Reach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      200+ countries and territories covered with premium network partnerships.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Customer First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      24/7 support and user-friendly solutions designed with travelers in mind.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/team-working-on-global-connectivity-solutions.png"
                alt="Our mission illustration"
                width={600}
                height={500}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Our Values</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of connectivity technology to deliver cutting-edge solutions that
                  exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We maintain the highest standards in service quality, network reliability, and customer satisfaction
                  across all touchpoints.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Trust</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We build lasting relationships through transparency, security, and consistent delivery on our promises
                  to customers worldwide.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">Join Our Global Community</h2>
            <p className="text-xl opacity-90 text-pretty">
              Be part of the connectivity revolution. Experience the freedom of staying connected anywhere in the world
              with eSIM Global.
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
