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

import { modelA, modelB } from "@/lib/tax";

// Bruto vs Neto (EUR, kvartalno) za Model A i B
const buildChartData = (eurToRsd, insuredElsewhere) =>
  Array.from({ length: 41 }, (_, i) => {
    const bruto = i * 250;
    const net = (model) =>
      Math.round(model(bruto * eurToRsd, insuredElsewhere).netRsd / eurToRsd);
    return { bruto, modelA: net(modelA), modelB: net(modelB) };
  });

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

export const Chart = ({ insuredElsewhere, eurToRsd }) => {
  const data = buildChartData(eurToRsd, insuredElsewhere);

  return (
    <Card className='bg-background'>
      <CardHeader>
        <CardTitle>
          Poređenje modela A i B (
          {`${
            insuredElsewhere
              ? "Bez doprinosa za zdravstvo"
              : "Sa doprinosom za zdravstvo"
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
            data={data}
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
