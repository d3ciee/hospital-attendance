<script lang="ts">
	import { Badge } from '$lib/ui/badge';
	import * as Card from '$lib/ui/card';
	import { CalendarIcon, Clock, ClockIcon } from 'lucide-svelte';
</script>

<main class="grid flex-1 grid-cols-1 gap-6 p-6 md:p-10 lg:grid-cols-[1fr_300px]">
	<div class="grid gap-6">
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total Hours</Card.Title>
					<ClockIcon class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">2,345</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">+10% from last month</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Late Arrivals</Card.Title>
					<ClockIcon class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">145</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">+5% from last month</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Absences</Card.Title>
					<CalendarIcon class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">32</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">-2% from last month</p>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Overtime Hours</Card.Title>
					<Clock class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">125</div>
					<p class="text-xs text-gray-500 dark:text-gray-400">+15% from last month</p>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="grid gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Attendance Overview</Card.Title>
				</Card.Header>
				<Card.Content>
					<!-- <LineChart class="aspect-[16/9]" /> -->
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header>
					<Card.Title>Attendance by Department</Card.Title>
				</Card.Header>
				<Card.Content>
					<!-- <BarChart class="aspect-[16/9]" /> -->
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	<div class="space-y-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Employee Attendance</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="grid gap-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<img
								alt="Avatar"
								class="aspect-square rounded-full object-cover"
								height="32"
								src="/placeholder.svg"
								width="32"
							/>
							<div>
								<p class="font-medium">John Doe</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Software Engineer</p>
							</div>
						</div>
						<Badge variant="default">Present</Badge>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<img
								alt="Avatar"
								class="aspect-square rounded-full object-cover"
								height="32"
								src="/placeholder.svg"
								width="32"
							/>
							<div>
								<p class="font-medium">Jane Smith</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
							</div>
						</div>
						<Badge variant="destructive">Absent</Badge>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<img
								alt="Avatar"
								class="aspect-square rounded-full object-cover"
								height="32"
								src="/placeholder.svg"
								width="32"
							/>
							<div>
								<p class="font-medium">Bob Johnson</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">UI Designer</p>
							</div>
						</div>
						<Badge variant="secondary">Late</Badge>
					</div>
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<img
								alt="Avatar"
								class="aspect-square rounded-full object-cover"
								height="32"
								src="/placeholder.svg"
								width="32"
							/>
							<div>
								<p class="font-medium">Sarah Lee</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Data Analyst</p>
							</div>
						</div>
						<Badge variant="default">Present</Badge>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</main>

<!-- <div {...props}>
      <ResponsiveBar
        data={[
          { name: "Jan", count: 111 },
          { name: "Feb", count: 157 },
          { name: "Mar", count: 129 },
          { name: "Apr", count: 150 },
          { name: "May", count: 119 },
          { name: "Jun", count: 72 },
        ]}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  )
}



function LineChart(props) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}


function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

=== styles.css ===

body {
  font-family: var(--font-inter), sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-inter), sans-serif;
}

=== layout.jsx ===

// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required

import { Inter } from 'next/font/google'
import './styles.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body class={inter.variable}>
        {children}
      </body>
    </html>
  )
} -->
