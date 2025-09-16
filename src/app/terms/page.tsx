import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { AuthHeader } from "@/src/components/auth-header"
import { Badge } from "../../components/ui/badge"
import {
  Globe,
  FileText,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Terms of Service</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Terms Content */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none space-y-8">
                {/* Introduction */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    Welcome to eSIM Global. These Terms of Service ("Terms") govern your use of our website and services. 
                    By accessing or using our services, you agree to be bound by these Terms.
                  </p>
                  <p className="text-muted-foreground">
                    eSIM Global provides digital SIM card services that allow you to access mobile data networks worldwide 
                    without physical SIM cards.
                  </p>
                </section>

                {/* Definitions */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Definitions</h2>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <strong>"Service"</strong> refers to the eSIM Global website and eSIM services.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>"User"</strong> refers to any individual or entity using our Service.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>"eSIM"</strong> refers to embedded SIM technology that allows digital activation of mobile services.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>"Plan"</strong> refers to the data package you purchase for use with our eSIM service.
                    </p>
                  </div>
                </section>

                {/* Eligibility */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">3. Eligibility</h2>
                  <p className="text-muted-foreground mb-4">
                    To use our Service, you must:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Be at least 18 years old or have parental consent</li>
                    <li>Have a compatible device that supports eSIM technology</li>
                    <li>Provide accurate and complete information during registration</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                {/* Service Description */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Service Description</h2>
                  <p className="text-muted-foreground mb-4">
                    Our Service provides:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Digital eSIM profiles for mobile data access</li>
                    <li>Coverage in multiple countries worldwide</li>
                    <li>Various data plans with different durations and limits</li>
                    <li>Customer support and technical assistance</li>
                    <li>Online account management and billing</li>
                  </ul>
                </section>

                {/* User Responsibilities */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">5. User Responsibilities</h2>
                  <p className="text-muted-foreground mb-4">
                    You agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Use the Service only for lawful purposes</li>
                    <li>Not attempt to circumvent any security measures</li>
                    <li>Not share your account credentials with others</li>
                    <li>Report any security concerns immediately</li>
                    <li>Comply with local laws and regulations when traveling</li>
                    <li>Use the Service responsibly and not for illegal activities</li>
                  </ul>
                </section>

                {/* Payment Terms */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Payment Terms</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      All plans are prepaid and must be purchased before use. Payment is processed securely through our 
                      payment partners.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Pricing:</strong> All prices are listed in USD and include applicable taxes where required.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Refunds:</strong> We offer a 30-day money-back guarantee for unused eSIMs. Once activated, 
                      eSIMs are non-refundable.
                    </p>
                    <p className="text-muted-foreground">
                      <strong>Billing:</strong> There are no recurring charges. Plans are valid for the specified duration 
                      from activation.
                    </p>
                  </div>
                </section>

                {/* Service Limitations */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Service Limitations</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Our Service is subject to the following limitations:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Coverage depends on local network availability</li>
                      <li>Data speeds may vary based on network conditions</li>
                      <li>Service may be unavailable in certain areas or during network maintenance</li>
                      <li>Device compatibility is required for eSIM functionality</li>
                      <li>Fair usage policies apply to prevent network abuse</li>
                    </ul>
                  </div>
                </section>

                {/* Privacy and Data */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Privacy and Data Protection</h2>
                  <p className="text-muted-foreground mb-4">
                    Your privacy is important to us. Our collection and use of personal information is governed by our 
                    Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your data, but no method of transmission over 
                    the internet is 100% secure.
                  </p>
                </section>

                {/* Intellectual Property */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
                  <p className="text-muted-foreground">
                    All content, trademarks, and intellectual property on our website and Service are owned by eSIM Global 
                    or our licensors. You may not use, reproduce, or distribute our content without permission.
                  </p>
                </section>

                {/* Disclaimers */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, 
                      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
                      PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                    <p className="text-muted-foreground">
                      We do not guarantee uninterrupted service or that the Service will meet your specific requirements.
                    </p>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
                  <p className="text-muted-foreground">
                    IN NO EVENT SHALL eSIM GLOBAL BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR 
                    PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE, INCURRED BY YOU OR 
                    ANY THIRD PARTY, WHETHER IN AN ACTION IN CONTRACT OR TORT.
                  </p>
                </section>

                {/* Termination */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      We may terminate or suspend your access to the Service immediately, without prior notice, for any 
                      reason, including breach of these Terms.
                    </p>
                    <p className="text-muted-foreground">
                      Upon termination, your right to use the Service will cease immediately, and any unused eSIM credits 
                      may be forfeited.
                    </p>
                  </div>
                </section>

                {/* Governing Law */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
                  <p className="text-muted-foreground">
                    These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], 
                    without regard to its conflict of law provisions.
                  </p>
                </section>

                {/* Changes to Terms */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">14. Changes to Terms</h2>
                  <p className="text-muted-foreground">
                    We reserve the right to modify these Terms at any time. We will notify users of any material changes 
                    by posting the new Terms on our website. Your continued use of the Service after such changes constitutes 
                    acceptance of the new Terms.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">15. Contact Information</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> legal@esimglobal.com<br />
                      <strong>Address:</strong> [Company Address]<br />
                      <strong>Phone:</strong> [Phone Number]
                    </p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
