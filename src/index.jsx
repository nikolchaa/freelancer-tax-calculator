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
import { modelA, modelB, TAX_YEAR } from "@/lib/tax";

const fmt = (n) =>
  n.toLocaleString("sr-RS", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Row = ({ label, value, className = "" }) => (
  <div className={`flex justify-between gap-4 ${className}`}>
    <span className='text-muted-foreground'>{label}</span>
    <span className='tabular-nums text-right'>{fmt(value)} RSD</span>
  </div>
);

const ModelCard = ({ name, result, rows, better }) => (
  <Card
    className={`bg-background transition-colors ${
      better ? "border-foreground/40" : ""
    }`}
  >
    <CardContent className='space-y-2 text-sm'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>
          Model {name}{" "}
          <span className='text-sm font-normal text-muted-foreground'>
            ({result.totalPercent.toFixed(2)}%)
          </span>
        </h2>
        {better && (
          <span className='rounded-full bg-foreground px-2.5 py-0.5 text-xs font-medium text-background'>
            Isplativije
          </span>
        )}
      </div>
      <Progress className={"my-3"} value={100 - result.totalPercent} />
      {rows.map(([label, value]) => (
        <Row key={label} label={label} value={value} />
      ))}
      <Row
        label='Porez + doprinosi'
        value={result.total}
        className='border-t pt-2 font-medium [&>span]:text-foreground'
      />
      <div className='mt-3 rounded-md bg-muted p-3'>
        <p className='text-xs text-muted-foreground'>Neto prihod</p>
        <p className='text-2xl font-bold tabular-nums'>{fmt(result.net)} €</p>
        <p className='text-sm text-muted-foreground tabular-nums'>
          {fmt(result.netRsd)} RSD
        </p>
      </div>
    </CardContent>
  </Card>
);

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

  const withEur = (r) => ({ ...r, net: r.netRsd / eurToRsd });
  const a = withEur(modelA(incomeRsd, insuredElsewhere));
  const b = withEur(modelB(incomeRsd, insuredElsewhere));

  const better = a.netRsd >= b.netRsd ? "A" : "B";

  return (
    <div className='max-w-3xl mx-auto p-6 space-y-6'>
      <header className='space-y-2'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Kalkulator poreza za frilensere
        </h1>
        <p className='text-sm text-muted-foreground'>
          Kvartalni obračun po parametrima za {TAX_YEAR}. godinu • Srednji kurs
          EUR (NBS): {fmt(eurToRsd)} RSD
        </p>
      </header>
      <Card className={"bg-background"}>
        <CardContent className='space-y-4'>
          <label className='font-medium'>Bruto prihod u kvartalu:</label>
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
            min='0'
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
          <p className='text-sm text-muted-foreground'>
            {currency === "EUR"
              ? `≈ ${fmt(income * eurToRsd)} RSD`
              : `≈ ${fmt(income / eurToRsd)} EUR`}
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
        <ModelCard
          name='A'
          result={a}
          better={incomeRsd > 0 && better === "A"}
          rows={[
            ["Osnovica", a.taxBase],
            ["Porez (20%)", a.tax],
            ["PIO (24%)", a.pio],
            ["Zdravstvo (10,3%)", a.health],
          ]}
        />
        <ModelCard
          name='B'
          result={b}
          better={incomeRsd > 0 && better === "B"}
          rows={[
            ["Osnovica", b.taxBase],
            ["Porez (10%)", b.tax],
            ["PIO (24%, min. 36.934)", b.pio],
            ["Zdravstvo (10,3%)", b.health],
          ]}
        />
      </div>
      <Chart insuredElsewhere={insuredElsewhere} eurToRsd={eurToRsd} />
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
