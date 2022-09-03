import { Project } from "./types";

export const projects: Project[] = [
  {
    name: "My App",
    gitUrl: "https://github.com/my/app",
    rootFolder: "Frontend/src",
    patches: [
      {
        name: "disable some failing test",
        file: "tests/some.spec.js",
        search: "it('some test name',",
        replace: "xit('some test name',",
      },
    ],
    commands: [
      { name: "build", npmScriptName: "build-dev" },
      { name: "unit test", npmScriptName: "test-karma" },
    ],
  },
];
