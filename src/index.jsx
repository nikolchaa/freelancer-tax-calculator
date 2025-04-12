"use client";

import { hydrate, prerender as ssr } from "preact-iso";
import { ThemeProvider } from "./components/theme-provider";
import "./style.css";
import { useEffect, useState } from "preact/hooks";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Chart } from "@/components/line-chart";
import { Progress } from "@/components/ui/progress";

export function App() {
  const [eurToRsd, setEurToRsd] = useState(117.5);
  const [income, setIncome] = useState(5000);
  const [currency, setCurrency] = useState("EUR");
  const [insuredElsewhere, setInsuredElsewhere] = useState(false);

  const incomeEur = currency === "EUR" ? income : income / eurToRsd;
  const incomeRsd = incomeEur * eurToRsd;

  useEffect(() => {
    fetch("/.netlify/functions/exchange-rate")
      .then((res) => res.json())
      .then((data) => {
        const kurs = data.exchange_middle;
        if (kurs) {
          setEurToRsd(kurs);
        }
      });
  }, []);

  const modelA = () => {
    const exempt = 107738;
    const base = Math.max(incomeRsd - exempt, 0);
    const tax = base > 0 ? base * 0.2 : 0;
    const pio = base > 0 ? base * 0.24 : 0;
    const health =
      base > 0 ? (insuredElsewhere ? 0 : Math.max(base * 0.103, 5497)) : 0;
    const total = tax + pio + health;
    return {
      net: (incomeRsd - total) / eurToRsd,
      netRsd: incomeRsd - total,
      taxBase: base,
      tax,
      pio,
      health,
      total,
      totalPercent: incomeRsd > 0 ? (total / incomeRsd) * 100 : 0,
    };
  };

  const modelB = () => {
    const exempt = 107738;
    if (incomeRsd <= exempt) {
      return {
        net: incomeRsd / eurToRsd,
        netRsd: incomeRsd,
        taxBase: 0,
        tax: 0,
        pio: 0,
        health: 0,
        total: 0,
        totalPercent: 0,
      };
    }
    const fixed = 64979 + incomeRsd * 0.34;
    const base = Math.max(incomeRsd - fixed, 0);
    const tax = base > 0 ? base * 0.1 : 0;
    const pio = base > 0 ? Math.max(base * 0.24, 23160 * 3) : 0;
    const health =
      base > 0 ? (insuredElsewhere ? 0 : Math.max(base * 0.103, 4206)) : 0;
    const total = tax + pio + health;
    return {
      net: (incomeRsd - total) / eurToRsd,
      netRsd: incomeRsd - total,
      taxBase: base,
      tax,
      pio,
      health,
      total,
      totalPercent: incomeRsd > 0 ? (total / incomeRsd) * 100 : 0,
    };
  };

  const a = modelA();
  const b = modelB();

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      <h1 className='text-3xl font-bold'>Kalkulator poreza za frilensere</h1>
      <p className='text-sm text-gray-600'>
        Srednji kurs EUR (NBS): {eurToRsd.toFixed(2)} RSD
      </p>
      <Card className={"bg-background"}>
        <CardContent className='space-y-4'>
          <label className='font-medium'>Bruto prihod:</label>
          <RadioGroup
            defaultValue='EUR'
            className='flex gap-4 pt-3'
            onValueChange={(val) => setCurrency(val)}
          >
            <div className='flex items-center space-x-2'>
              <RadioGroupItem
                value='EUR'
                id='r1'
                checked={currency === "EUR"}
              />
              <Label htmlFor='r1'>EUR</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem
                value='RSD'
                id='r2'
                checked={currency === "RSD"}
              />
              <Label htmlFor='r2'>RSD</Label>
            </div>
          </RadioGroup>
          <Input
            type='number'
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
          <p className='text-sm text-gray-500'>
            {currency === "EUR"
              ? `≈ ${(income * eurToRsd).toFixed(2)} RSD`
              : `≈ ${(income / eurToRsd).toFixed(2)} EUR`}
          </p>
          <div className='flex items-center gap-2'>
            <Switch
              checked={insuredElsewhere}
              onCheckedChange={setInsuredElsewhere}
              id='insuredElsewhere'
            />
            <Label htmlFor='insuredElsewhere'>
              Već sam zdravstveno osiguran (npr. zaposlen)
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card className={"bg-background"}>
          <CardContent className='space-y-1'>
            <h2 className='text-xl font-semibold mb-2'>
              Model A{" "}
              <span className='text-sm font-normal text-muted-foreground'>
                ({a.totalPercent.toFixed(2)}%)
              </span>
            </h2>
            <Progress className={"my-2"} value={100 - a.totalPercent} />
            <p>Osnovica: {a.taxBase.toFixed(2)} RSD</p>
            <p>Porez (20%): {a.tax.toFixed(2)} RSD</p>
            <p>Doprinos PIO (24%): {a.pio.toFixed(2)} RSD</p>
            <p>Doprinos za zdravstvo: {a.health.toFixed(2)} RSD</p>
            <p className='font-medium'>
              Porez + doprinosi: {a.total.toFixed(2)} RSD
            </p>
            <p className='text-ring font-bold'>
              Neto prihod (EUR): {a.net.toFixed(2)} €
            </p>
            <p className='text-ring font-bold'>
              Neto prihod (RSD): {a.netRsd.toFixed(2)} RSD
            </p>
          </CardContent>
        </Card>

        <Card className={"bg-background"}>
          <CardContent className='space-y-1'>
            <h2 className='text-xl font-semibold mb-2'>
              Model B{" "}
              <span className='text-sm font-normal text-muted-foreground'>
                ({b.totalPercent.toFixed(2)}%)
              </span>
            </h2>
            <Progress className={"my-2"} value={100 - b.totalPercent} />
            <p>Osnovica: {b.taxBase.toFixed(2)} RSD</p>
            <p>Porez (10%): {b.tax.toFixed(2)} RSD</p>
            <p>
              Doprinos PIO{" "}
              <span className={"text-[0.75rem]"}>(min. 3 mes.)</span>:{" "}
              {b.pio.toFixed(2)} RSD
            </p>
            <p>Doprinos za zdravstvo: {b.health.toFixed(2)} RSD</p>
            <p className='font-medium'>
              Porez + doprinosi: {b.total.toFixed(2)} RSD
            </p>
            <p className='text-ring font-bold'>
              Neto prihod (EUR): {b.net.toFixed(2)} €
            </p>
            <p className='text-ring font-bold'>
              Neto prihod (RSD): {b.netRsd.toFixed(2)} RSD
            </p>
          </CardContent>
        </Card>
      </div>
      <Chart healthInsurance={insuredElsewhere} />
      <footer className='text-center text-sm text-muted-foreground mt-6 space-y-1'>
        <p>
          Nikola Ranđelović (@nikolchaa) •{" "}
          <a
            href='https://nikolchaa.com'
            target='_blank'
            className='underline'
            rel='noreferrer'
          >
            nikolchaa.com
          </a>
        </p>
        <p className='space-x-4'>
          <a href='mailto:nikolchaa@netrunners.work' className='underline'>
            Email
          </a>
          <a
            href='https://github.com/nikolchaa'
            target='_blank'
            className='underline'
            rel='noreferrer'
          >
            GitHub
          </a>
          <a
            href='https://instagram.com/nikolchaa'
            target='_blank'
            className='underline'
            rel='noreferrer'
          >
            Instagram
          </a>
        </p>
      </footer>
    </div>
  );
}

if (typeof window !== "undefined") {
  hydrate(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
    document.getElementById("app")
  );
}

export async function prerender(data) {
  return await ssr(
    <ThemeProvider>
      <App {...data} />
    </ThemeProvider>
  );
}
