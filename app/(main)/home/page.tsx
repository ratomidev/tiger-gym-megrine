"use client";
export default function Home() {
  return (
    <div className="relative h-full w-full">
      <div className="w-full max-w-6xl px-4 mx-auto">
        <section className="mb-12 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>
          <p className="text-lg mb-6 text-gray-500 dark:text-gray-400 max-w-2xl">
            Welcome to your performance dashboard. Track key metrics and
            insights at a glance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <div className="p-6 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Revenue Growth</h3>
              <p className="text-2xl font-bold mb-1">24%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Increased since last month
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Active Users</h3>
              <p className="text-2xl font-bold mb-1">14.2k</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +1.2k new users this week
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-2">Conversion Rate</h3>
              <p className="text-2xl font-bold mb-1">3.6%</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                +0.8% since last period
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Performance Analysis</h2>
          <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">Key Insights</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <p>
                  Revenue has shown consistent growth over the past quarter,
                  with a significant 24% increase in the last month.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <p>
                  User engagement metrics indicate higher retention rates, with
                  daily active users increasing by 18%.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <p>
                  Geographic expansion into European markets has contributed to
                  a 32% growth in international sales.
                </p>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <p>
                  Mobile platform usage continues to dominate, accounting for
                  72% of total user sessions.
                </p>
              </li>
            </ul>
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-3">Short Term Actions</h3>
              <p className="mb-4">
                Consider implementing these strategies to optimize performance:
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Increase marketing spend in high-converting channels</li>
                <li>Optimize mobile checkout flow to reduce abandonment</li>
                <li>
                  Deploy targeted re-engagement campaigns for dormant users
                </li>
              </ol>
            </div>

            <div className="p-6 rounded-lg bg-white/5 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold mb-3">Long Term Strategy</h3>
              <p className="mb-4">Focus on these areas for sustained growth:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Expand product offerings in highest-margin categories</li>
                <li>
                  Develop partnerships with complementary service providers
                </li>
                <li>
                  Invest in AI-powered personalization to increase user
                  retention
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Market Trends</h2>
          <div className="bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <div className="prose dark:prose-invert max-w-none">
              <p className="mb-4">
                Our analysis reveals several key market trends that may impact
                business outcomes in the coming quarter:
              </p>

              <h4 className="text-xl font-medium mt-6 mb-2">
                Consumer Behavior Shifts
              </h4>
              <p>
                Recent data points to a significant shift toward sustainable
                products, with 68% of consumers willing to pay premium prices
                for environmentally friendly alternatives. This presents both
                opportunities for new product lines and challenges for
                established offerings.
              </p>

              <h4 className="text-xl font-medium mt-6 mb-2">
                Competitive Landscape
              </h4>
              <p>
                The entry of new technology-first competitors has disrupted
                traditional market segments. Companies leveraging AI for
                personalization are seeing 34% higher customer retention rates
                compared to industry averages.
              </p>

              <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 italic">
                The most successful businesses will be those that can
                seamlessly integrate digital technologies with human-centered
                experiences.
                <footer className="text-sm mt-2">
                  — Industry Analysis Report, Q1 2025
                </footer>
              </blockquote>

              <h4 className="text-xl font-medium mt-6 mb-2">
                Regulatory Changes
              </h4>
              <p>
                Upcoming regulatory changes in data privacy may require
                significant adjustments to customer data collection and
                processing procedures. Preparation should begin immediately to
                ensure compliance by the Q3 2025 deadline.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Financial Highlights</h2>
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
                    Q1 2025
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    Q2 2025 (Projected)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm font-semibold bg-gray-50 dark:bg-gray-800"
                  >
                    YoY Change
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Revenue
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$4.2M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$4.8M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +24%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Operating Costs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$2.8M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$3.1M</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                    +12%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Profit Margin
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">28%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">32%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    +4%
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    Customer Acquisition Cost
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$42</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">$38</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500">
                    -10%
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
