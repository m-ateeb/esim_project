import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { AuthHeader } from "@/src/components/auth-header"
import { Badge } from "../../components/ui/badge"
import {
  Globe,
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Calendar,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center space-y-6 mb-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Privacy Content */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <div className="prose prose-gray max-w-none space-y-8">
                {/* Introduction */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground mb-4">
                    At eSIM Global, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website 
                    and eSIM services.
                  </p>
                  <p className="text-muted-foreground">
                    By using our Service, you consent to the data practices described in this policy. If you do not agree with our 
                    policies and practices, please do not use our Service.
                  </p>
                </section>

                {/* Information We Collect */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
                  <p className="text-muted-foreground mb-4">
                    We collect personal information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Billing and payment information</li>
                    <li>Device information and eSIM activation details</li>
                    <li>Account credentials and preferences</li>
                    <li>Communication history with our support team</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
                  <p className="text-muted-foreground mb-4">
                    We automatically collect certain information when you use our Service:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, features used)</li>
                    <li>Location data (country/region for service delivery)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">eSIM Usage Data</h3>
                  <p className="text-muted-foreground">
                    We collect limited usage data related to your eSIM service, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Data usage statistics</li>
                    <li>Network connection information</li>
                    <li>Service activation and deactivation times</li>
                    <li>Coverage area information</li>
                  </ul>
                </section>

                {/* How We Use Information */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-4">
                    We use the information we collect for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Provide and maintain our eSIM services</li>
                    <li>Process payments and manage billing</li>
                    <li>Send important service notifications and updates</li>
                    <li>Provide customer support and technical assistance</li>
                    <li>Improve our services and develop new features</li>
                    <li>Ensure security and prevent fraud</li>
                    <li>Comply with legal obligations</li>
                    <li>Send marketing communications (with your consent)</li>
                  </ul>
                </section>

                {/* Information Sharing */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-muted-foreground mb-4">
                    We do not sell, trade, or rent your personal information to third parties. We may share your information 
                    in the following circumstances:
                  </p>
                  
                  <h3 className="text-xl font-semibold mb-3">Service Providers</h3>
                  <p className="text-muted-foreground mb-4">
                    We may share information with trusted third-party service providers who assist us in:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                    <li>Payment processing and billing</li>
                    <li>Network infrastructure and connectivity</li>
                    <li>Customer support and communication</li>
                    <li>Data analytics and service improvement</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Legal Requirements</h3>
                  <p className="text-muted-foreground mb-4">
                    We may disclose your information if required by law or in response to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                    <li>Valid legal requests from government authorities</li>
                    <li>Court orders or subpoenas</li>
                    <li>Protection of our rights and property</li>
                    <li>Emergency situations involving public safety</li>
                  </ul>

                  <h3 className="text-xl font-semibold mb-3">Business Transfers</h3>
                  <p className="text-muted-foreground">
                    In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
                    of the business transaction, subject to the same privacy protections.
                  </p>
                </section>

                {/* Data Security */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal information, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Secure payment processing with PCI DSS compliance</li>
                    <li>Regular security audits and vulnerability assessments</li>
                    <li>Access controls and authentication measures</li>
                    <li>Employee training on data protection practices</li>
                    <li>Incident response and breach notification procedures</li>
                  </ul>
                </section>

                {/* Data Retention */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">6. Data Retention</h2>
                  <p className="text-muted-foreground mb-4">
                    We retain your personal information for as long as necessary to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                    <li>Provide our services to you</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes and enforce agreements</li>
                    <li>Improve our services</li>
                  </ul>
                  <p className="text-muted-foreground">
                    When we no longer need your information, we will securely delete or anonymize it in accordance with 
                    applicable laws and regulations.
                  </p>
                </section>

                {/* Your Rights */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">7. Your Privacy Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Access:</strong> Request a copy of your personal information</li>
                    <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                    <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                    <li><strong>Portability:</strong> Receive your data in a portable format</li>
                    <li><strong>Restriction:</strong> Limit how we process your information</li>
                    <li><strong>Objection:</strong> Object to certain processing activities</li>
                    <li><strong>Withdrawal:</strong> Withdraw consent for marketing communications</li>
                  </ul>
                </section>

                {/* Cookies and Tracking */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">8. Cookies and Tracking Technologies</h2>
                  <p className="text-muted-foreground mb-4">
                    We use cookies and similar technologies to enhance your experience on our website:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
                    <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                    <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    You can control cookie settings through your browser preferences. However, disabling certain cookies 
                    may affect the functionality of our website.
                  </p>
                </section>

                {/* International Transfers */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
                  <p className="text-muted-foreground">
                    Your information may be transferred to and processed in countries other than your own. We ensure 
                    that such transfers comply with applicable data protection laws and implement appropriate safeguards 
                    to protect your information.
                  </p>
                </section>

                {/* Children's Privacy */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">10. Children's Privacy</h2>
                  <p className="text-muted-foreground">
                    Our Service is not intended for children under 13 years of age. We do not knowingly collect personal 
                    information from children under 13. If you believe we have collected information from a child under 13, 
                    please contact us immediately.
                  </p>
                </section>

                {/* Changes to Policy */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">11. Changes to This Privacy Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by 
                    posting the new policy on our website and updating the "Last updated" date. Your continued use of 
                    our Service after such changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                {/* Contact Information */}
                <section>
                  <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
                  <p className="text-muted-foreground mb-4">
                    If you have any questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="text-muted-foreground">
                      <strong>Email:</strong> privacy@esimglobal.com<br />
                      <strong>Address:</strong> [Company Address]<br />
                      <strong>Phone:</strong> [Phone Number]<br />
                      <strong>Data Protection Officer:</strong> dpo@esimglobal.com
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
