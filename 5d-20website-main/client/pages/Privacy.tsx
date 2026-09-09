import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  Database,
  UserCheck,
  Globe,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-purple-600 hover:text-purple-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Lilly's Fashion
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
              <CardTitle className="text-4xl font-bold flex items-center justify-center">
                <Shield className="w-10 h-10 mr-4" />
                Privacy Policy
              </CardTitle>
              <p className="text-purple-100 mt-2 text-lg">
                Your privacy matters to us • Last updated:{" "}
                {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-purple-600" />
                  Our Commitment to Privacy
                </h2>
                <p className="text-gray-600 mb-4">
                  At Lilly's Fashion Couture, we are committed to protecting
                  your privacy and ensuring the security of your personal
                  information. This Privacy Policy explains how we collect, use,
                  and safeguard your data when you use our marketplace platform.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 font-medium">
                    🔒 We never sell your personal information to third parties.
                  </p>
                </div>
              </section>

              {/* Information We Collect */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-600" />
                  Information We Collect
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Personal Information
                    </h3>
                    <ul className="space-y-2 text-gray-600 ml-4">
                      <li>
                        • <strong>Account Information:</strong> Name, email
                        address, phone number, password
                      </li>
                      <li>
                        • <strong>Seller Information:</strong> Banking details
                        (for payouts), business information, tax identification
                      </li>
                      <li>
                        • <strong>Verification Data:</strong> Identity
                        verification documents, SMS/email verification codes
                      </li>
                      <li>
                        • <strong>Communication:</strong> Messages, support
                        tickets, feedback, and reviews
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Transaction Information
                    </h3>
                    <ul className="space-y-2 text-gray-600 ml-4">
                      <li>
                        • <strong>Purchase History:</strong> Items bought,
                        prices paid, shipping addresses
                      </li>
                      <li>
                        • <strong>Sales Data:</strong> Items sold, commission
                        earnings, payout history
                      </li>
                      <li>
                        • <strong>Payment Information:</strong> Processed
                        securely by our payment partners (we don't store full
                        credit card numbers)
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Usage Information
                    </h3>
                    <ul className="space-y-2 text-gray-600 ml-4">
                      <li>
                        • <strong>Website Activity:</strong> Pages visited, time
                        spent, click patterns
                      </li>
                      <li>
                        • <strong>Device Information:</strong> IP address,
                        browser type, device type, operating system
                      </li>
                      <li>
                        • <strong>Preferences:</strong> Saved items, search
                        history, notification settings
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <UserCheck className="w-6 h-6 mr-2 text-green-600" />
                  How We Use Your Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3">
                      Platform Operations
                    </h3>
                    <ul className="space-y-1 text-green-700 text-sm">
                      <li>• Process transactions and payments</li>
                      <li>• Manage seller payouts (90% earnings)</li>
                      <li>• Verify user identities</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3">
                      User Experience
                    </h3>
                    <ul className="space-y-1 text-blue-700 text-sm">
                      <li>• Personalize recommendations</li>
                      <li>• Send order updates and notifications</li>
                      <li>• Improve platform functionality</li>
                      <li>• Analyze usage patterns</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 mb-3">
                      Security & Safety
                    </h3>
                    <ul className="space-y-1 text-purple-700 text-sm">
                      <li>• Prevent fraud and abuse</li>
                      <li>• Monitor for suspicious activity</li>
                      <li>• Enforce our Terms of Service</li>
                      <li>• Protect user accounts</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 mb-3">
                      Communications
                    </h3>
                    <ul className="space-y-1 text-orange-700 text-sm">
                      <li>• Welcome emails for new users</li>
                      <li>• Transaction confirmations</li>
                      <li>• Marketing (with your consent)</li>
                      <li>• Platform updates and news</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-red-600" />
                  When We Share Information
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Service Providers:</strong> We share data with
                    trusted partners who help us operate our platform (payment
                    processors, shipping companies, email services) under strict
                    confidentiality agreements.
                  </p>
                  <p>
                    <strong>Business Transfers:</strong> If we are acquired or
                    merged, your information may be transferred as part of that
                    transaction.
                  </p>
                  <p>
                    <strong>Legal Requirements:</strong> We may disclose
                    information when required by law, court order, or to protect
                    our rights and safety.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">
                      ❌ We DO NOT sell your personal information to advertisers
                      or data brokers.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Lock className="w-6 h-6 mr-2 text-purple-600" />
                  Data Security & Protection
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We implement industry-standard security measures to protect
                    your information:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Technical Safeguards
                      </h4>
                      <ul className="space-y-1 text-purple-700 text-sm">
                        <li>• SSL/TLS encryption</li>
                        <li>• Secure data centers</li>
                        <li>• Regular security audits</li>
                        <li>• Access controls</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Operational Security
                      </h4>
                      <ul className="space-y-1 text-blue-700 text-sm">
                        <li>• Employee background checks</li>
                        <li>• Limited data access</li>
                        <li>• Incident response procedures</li>
                        <li>• Regular staff training</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Your Rights */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <UserCheck className="w-6 h-6 mr-2 text-green-600" />
                  Your Privacy Rights
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>You have the following rights regarding your data:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">
                        Access & Control
                      </h4>
                      <ul className="space-y-1 text-green-700 text-sm">
                        <li>• View your personal data</li>
                        <li>• Update account information</li>
                        <li>• Download your data</li>
                        <li>• Delete your account</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        Communication Preferences
                      </h4>
                      <ul className="space-y-1 text-blue-700 text-sm">
                        <li>• Opt out of marketing emails</li>
                        <li>• Control notification settings</li>
                        <li>• Manage SMS preferences</li>
                        <li>• Update consent choices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Cookies */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Cookies & Tracking
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We use cookies and similar technologies to improve your
                    experience:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>
                      • <strong>Essential Cookies:</strong> Required for
                      platform functionality (login, shopping cart)
                    </li>
                    <li>
                      • <strong>Analytics Cookies:</strong> Help us understand
                      how you use our platform
                    </li>
                    <li>
                      • <strong>Preference Cookies:</strong> Remember your
                      settings and choices
                    </li>
                  </ul>
                  <p>
                    You can manage cookie preferences through your browser
                    settings.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-purple-600" />
                  Privacy Questions & Requests
                </h2>
                <p className="text-gray-600 mb-4">
                  For privacy-related questions, data requests, or concerns:
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Contact Information
                      </h4>
                      <p className="text-purple-700 text-sm">
                        <strong>Email:</strong> privacy@lillys.com
                        <br />
                        <strong>Phone:</strong> (555) 123-4567
                        <br />
                        <strong>Address:</strong> 123 Fashion Ave, NY 10001
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">
                        Response Times
                      </h4>
                      <p className="text-purple-700 text-sm">
                        • Privacy requests: 30 days
                        <br />
                        • Data deletion: 7-14 days
                        <br />
                        • General inquiries: 2-3 business days
                        <br />• Urgent matters: 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t">
                <Link to="/" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                  >
                    Return to Home
                  </Button>
                </Link>
                <Link to="/signup" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    I Understand - Sign Up Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
