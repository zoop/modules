import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Panel = { title: string; body: string };

export default function DeveloperTabs({
  request,
  response,
}: {
  request: Panel;
  response: Panel;
}) {
  return (
    <Tabs defaultValue="request" className="w-full gap-3">
      <TabsList className="bg-navy-800 text-navy-200">
        <TabsTrigger
          value="request"
          className="data-[state=active]:bg-navy-950 data-[state=active]:text-teal-300 text-navy-200 px-4"
        >
          Request
        </TabsTrigger>
        <TabsTrigger
          value="response"
          className="data-[state=active]:bg-navy-950 data-[state=active]:text-teal-300 text-navy-200 px-4"
        >
          Response
        </TabsTrigger>
      </TabsList>

      {[
        { value: "request", panel: request },
        { value: "response", panel: response },
      ].map(({ value, panel }) => (
        <TabsContent key={value} value={value}>
          <div className="border-navy-700 bg-navy-950 overflow-hidden rounded-xl border">
            <div className="border-navy-700 font-data text-teal-300 border-b px-4 py-2.5 text-xs">
              {panel.title}
            </div>
            <pre className="font-data text-navy-100 overflow-x-auto px-4 py-4 text-[12.5px] leading-relaxed">
              <code>{panel.body}</code>
            </pre>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
