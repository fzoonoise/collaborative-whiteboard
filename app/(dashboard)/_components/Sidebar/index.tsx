import { Hint } from "@/components/hint";
import { List } from "./List";
import { NewButton } from "./NewButton";

const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-blue-950 h-full w-[60px] flex p-3 flex-col justify-between text-white">
      <div className="flex flex-col gap-y-4">
        <List />
        <NewButton />
      </div>

      <div className="aspect-square">
        <Hint label="Source Code" side="right" align="start" sideOffset={18}>
          <a
            className="flex items-center justify-center w-full h-full transition rounded-sm bg-white/25 opacity-60 hover:opacity-100"
            // href={links.sourceCode}
            target="_blank"
            rel="noreferrer noopener"
          >
            {/* <Github className="w-5 h-5 text-white" /> */}
          </a>
        </Hint>
      </div>
    </aside>
  );
};

export default Sidebar;
