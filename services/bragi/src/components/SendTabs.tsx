import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Mode = { name: string; returns: string; featured?: boolean };

export default function SendTabs({ modes }: { modes: Mode[] }) {
  return (
    <Tabs defaultValue={modes[0]?.name} className="mt-10 w-full gap-4">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1 sm:w-auto">
        {modes.map((m) => (
          <TabsTrigger key={m.name} value={m.name} className="flex-none px-4 py-2">
            {m.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {modes.map((m) => (
        <TabsContent key={m.name} value={m.name}>
          <Card
            className={
              m.featured
                ? "border-brand/50 bg-brand/[0.06]"
                : undefined
            }
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">{m.name}</CardTitle>
                {m.featured && <Badge variant="accent">Most complete</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{m.returns}</p>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
}
