import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, FileText, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

export default function Terms() {
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
                <FileText className="w-10 h-10 mr-4" />
                Terms of Service
              </CardTitle>
              <p className="text-purple-100 mt-2 text-lg">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-purple-600" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  Welcome to Lilly's Fashion Couture. By accessing and using our
                  platform, you agree to be bound by these Terms of Service and
                  all applicable laws and regulations. If you do not agree with
                  any of these terms, you are prohibited from using our
                  services.
                </p>
                <p className="text-gray-600">
                  These terms apply to all visitors, users, and sellers who
                  access or use our marketplace platform.
                </p>
              </section>

              {/* Seller Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                  Seller Agreement & Commission Structure
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">
                    Commission & Payment Terms
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>
                      • <strong>Commission Rate:</strong> 10% platform fee on
                      all sales
                    </li>
                    <li>
                      • <strong>Seller Earnings:</strong> You retain 90% of each
                      sale
                    </li>
                    <li>
                      • <strong>Payment Schedule:</strong> Weekly automatic
                      payouts to your bank account
                    </li>
                    <li>
                      • <strong>Minimum Payout:</strong> $25 minimum for
                      withdrawal
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600 mb-4">
                  By registering as a seller, you agree to our commission
                  structure and payment terms. All sales are processed through
                  our secure payment system, and commissions are automatically
                  deducted before payout.
                </p>
              </section>

              {/* User Accounts */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  User Accounts & Responsibilities
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Account Registration:</strong> You must provide
                    accurate, current, and complete information during
                    registration. You are responsible for maintaining the
                    confidentiality of your account credentials.
                  </p>
                  <p>
                    <strong>Seller Verification:</strong> Sellers must provide
                    valid banking information for payouts and may be required to
                    verify their identity through email or SMS verification.
                  </p>
                  <p>
                    <strong>Prohibited Activities:</strong> You may not use our
                    platform for any unlawful purpose, to sell prohibited items,
                    or to engage in fraudulent activities.
                  </p>
                </div>
              </section>

              {/* Product Listings */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Product Listings & Content
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Content Ownership:</strong> Sellers retain ownership
                    of their product content but grant us a license to display
                    and promote their listings on our platform.
                  </p>
                  <p>
                    <strong>Content Standards:</strong> All product listings
                    must be accurate, legal, and comply with our content
                    policies. We reserve the right to remove listings that
                    violate our standards.
                  </p>
                  <p>
                    <strong>Intellectual Property:</strong> Sellers must ensure
                    they have the right to sell all listed items and that
                    listings do not infringe on third-party intellectual
                    property rights.
                  </p>
                </div>
              </section>

              {/* Platform Use */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Platform Use & Limitations
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Service Availability:</strong> We strive to maintain
                    continuous service but do not guarantee uninterrupted
                    access. Maintenance and updates may temporarily affect
                    availability.
                  </p>
                  <p>
                    <strong>Data Usage:</strong> We collect and use data as
                    described in our Privacy Policy to improve our services and
                    facilitate transactions.
                  </p>
                  <p>
                    <strong>Third-Party Services:</strong> Our platform may
                    integrate with third-party services (payment processors,
                    shipping providers) subject to their respective terms.
                  </p>
                </div>
              </section>

              {/* Disputes & Refunds */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Disputes & Refunds
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    <strong>Buyer Protection:</strong> We offer buyer protection
                    for eligible purchases. Disputes must be reported within 30
                    days of purchase.
                  </p>
                  <p>
                    <strong>Seller Protection:</strong> Sellers are protected
                    against fraudulent chargebacks when they follow our shipping
                    and documentation requirements.
                  </p>
                  <p>
                    <strong>Resolution Process:</strong> We facilitate dispute
                    resolution between buyers and sellers. Our decision in
                    disputes is final.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Account Termination
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We reserve the right to terminate or suspend accounts that
                    violate these terms, engage in fraudulent activity, or harm
                    the platform community.
                  </p>
                  <p>
                    Upon termination, outstanding payments will be processed
                    according to our standard schedule, subject to any holds
                    required for dispute resolution.
                  </p>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Limitation of Liability
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-600 text-sm">
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, LILLY'S FASHION
                    COUTURE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                    SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT
                    NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Questions About These Terms?
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800">
                    <strong>Email:</strong> legal@lillys.com
                    <br />
                    <strong>Phone:</strong> (555) 123-4567
                    <br />
                    <strong>Address:</strong> 123 Fashion Ave, NY 10001
                  </p>
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
                    I Accept - Sign Up Now
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
