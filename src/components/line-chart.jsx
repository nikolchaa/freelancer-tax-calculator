"use client";

import { Circle } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Bruto vs Neto za Model A i B
const chartData = [
  { bruto: 0, modelA: 0, modelB: 0 },
  { bruto: 500, modelA: 500, modelB: 500 },
  { bruto: 1000, modelA: 955, modelB: 387 },
  { bruto: 1500, modelA: 1183, modelB: 820 },
  { bruto: 2000, modelA: 1412, modelB: 1253 },
  { bruto: 2500, modelA: 1640, modelB: 1686 },
  { bruto: 3000, modelA: 1869, modelB: 2119 },
  { bruto: 3500, modelA: 2097, modelB: 2552 },
  { bruto: 4000, modelA: 2326, modelB: 2985 },
  { bruto: 4500, modelA: 2554, modelB: 3418 },
  { bruto: 5000, modelA: 2783, modelB: 3783 },
  { bruto: 5500, modelA: 3011, modelB: 4137 },
  { bruto: 6000, modelA: 3240, modelB: 4491 },
  { bruto: 6500, modelA: 3468, modelB: 4845 },
  { bruto: 7000, modelA: 3697, modelB: 5198 },
  { bruto: 7500, modelA: 3925, modelB: 5552 },
  { bruto: 8000, modelA: 4154, modelB: 5906 },
  { bruto: 8500, modelA: 4382, modelB: 6260 },
  { bruto: 9000, modelA: 4611, modelB: 6614 },
  { bruto: 9500, modelA: 4839, modelB: 6967 },
  { bruto: 10000, modelA: 5068, modelB: 7321 },
];

const chartDataNoHealth = [
  { bruto: 0, modelA: 0, modelB: 0 },
  { bruto: 500, modelA: 500, modelB: 500 },
  { bruto: 1000, modelA: 963, modelB: 397 },
  { bruto: 1500, modelA: 1243, modelB: 864 },
  { bruto: 2000, modelA: 1523, modelB: 1331 },
  { bruto: 2500, modelA: 1803, modelB: 1798 },
  { bruto: 3000, modelA: 2083, modelB: 2265 },
  { bruto: 3500, modelA: 2363, modelB: 2732 },
  { bruto: 4000, modelA: 2643, modelB: 3199 },
  { bruto: 4500, modelA: 2923, modelB: 3666 },
  { bruto: 5000, modelA: 3203, modelB: 4066 },
  { bruto: 5500, modelA: 3483, modelB: 4453 },
  { bruto: 6000, modelA: 3763, modelB: 4841 },
  { bruto: 6500, modelA: 4043, modelB: 5229 },
  { bruto: 7000, modelA: 4323, modelB: 5617 },
  { bruto: 7500, modelA: 4603, modelB: 6005 },
  { bruto: 8000, modelA: 4883, modelB: 6392 },
  { bruto: 8500, modelA: 5163, modelB: 6780 },
  { bruto: 9000, modelA: 5443, modelB: 7168 },
  { bruto: 9500, modelA: 5723, modelB: 7556 },
  { bruto: 10000, modelA: 6003, modelB: 7944 },
];

const chartConfig = {
  modelA: {
    label: "Model A",
    color: "var(--chart-1)",
  },
  modelB: {
    label: "Model B",
    color: "var(--chart-2)",
  },
};

export const Chart = ({ healthInsurance }) => {
  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle>
          Poređenje modela A i B (
          {`${
            healthInsurance
              ? "Sa zdravstvenim osiguranjem"
              : "Bez zdravstvenog osiguranja"
          }`}
          )
        </CardTitle>
        <CardDescription>
          Prikaz odnosa bruto i neto prihoda u odnosu na modele A i B
        </CardDescription>
      </CardHeader>
      <CardContent className='overflow-x-auto'>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={healthInsurance ? chartData : chartDataNoHealth}
            margin={{ left: 12, bottom: 15, right: 12 }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='bruto'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[
                0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000,
              ]}
              label={{
                value: "Bruto prihod (EUR)",
                position: "bottom",
                offset: 5,
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={() => `Neto Prihod (EUR):`}
                />
              }
            />
            <Line
              dataKey='modelA'
              type='monotone'
              stroke='var(--ring)'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name='Model A'
            />
            <Line
              dataKey='modelB'
              type='monotone'
              stroke='var(--foreground)'
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              name='Model B'
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className='flex w-full items-center justify-center gap-10 text-sm'>
          <span className={"flex items-center gap-0.5"}>
            <Circle fill='var(--ring)' stroke='0' /> - Model A
          </span>
          <span className={"flex items-center gap-0.5"}>
            <Circle fill='var(--foreground)' stroke='0' /> - Model B
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};
