import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Calendar, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-50">
      <Header />

      {/* Confirmation Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-sans">Your Demo is Confirmed!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for scheduling a demo with WinSoft. We're excited to show you how our software can transform
              your business operations.
            </p>
          </div>
        </div>
      </section>

      {/* Confirmation Details */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 mb-12">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <Calendar className="w-12 h-12 text-blue-600 flex-shrink-0 mt-2" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">Confirmation Details</h2>
                  <div className="space-y-3 text-gray-600">
                    <p>
                      <span className="font-semibold">Date & Time:</span> Your demo is scheduled for [Date] at [Time]
                    </p>
                    <p>
                      <span className="font-semibold">Duration:</span> 30-45 minutes
                    </p>
                    <p>
                      <span className="font-semibold">Calendar Invitation:</span> Sent to your email address
                    </p>
                    <p>
                      <span className="font-semibold">Your Specialist:</span> [Salesperson's Name] will call you at the
                      scheduled time
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card className="shadow-lg border-l-4 border-l-blue-600 mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-sans">What Happens Next</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our specialist will call you at the scheduled time. Please ensure you are at a computer to get the
                  most out of the screen-sharing session.
                </p>
                <p>
                  We recommend having any specific questions or challenges ready to discuss during the demo to make the
                  most of your time with our expert.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Keep Them Engaged */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sans">
              While You Wait, Explore Our Success Stories
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              See the results we've delivered for businesses like yours with detailed case studies from our satisfied
              clients.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Dairy Case Study</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    See how we helped a dairy cooperative increase efficiency by 40%
                  </p>
                  <Link href="/case-studies">
                    <Button variant="outline" className="w-full group bg-transparent">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Sugar Factory Case Study</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Learn how we reduced production costs by 25% for a major sugar mill
                  </p>
                  <Link href="/case-studies">
                    <Button variant="outline" className="w-full group bg-transparent">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Gold Industry Case Study</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Discover how we streamlined inventory management for a jewelry chain
                  </p>
                  <Link href="/case-studies">
                    <Button variant="outline" className="w-full group bg-transparent">
                      View Case Study
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
