"use client";
import SectionCards from "@/components/dashboard/SectionCards";

export default function HomePage() {
  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        {/* Add the @container/main class to create the proper container context */}
        <div className="@container/main flex flex-1 flex-col">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">
            Gym Performance Highlights
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    Metric
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    Last Month
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    Current Month
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Active Memberships
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">152</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">173</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +21 (+13.8%)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    New Sign-ups
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">23</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">28</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +5 (+21.7%)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Membership Renewal Rate
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">82%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">87%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +5%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Average Daily Check-ins
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">68</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">74</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +6 (+8.8%)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Revenue per Member
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    120 DT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    125 DT
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +5 DT (+4.2%)
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Peak Hours Utilization
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">76%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">82%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +6%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to take action?</h2>
            <p className="mb-6 opacity-90">
              Schedule a strategy session with our team to discuss implementing
              these insights.
            </p>
            <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-opacity-90 transition-colors">
              Book Strategy Call
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
