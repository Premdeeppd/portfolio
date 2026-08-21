export interface Project {
  id: string;
  title: string;
  logo: string;
  liveUrl: string;
}

export const projects: Project[] = [
  {
    id: "examlo",
    title: "Examlo",
    logo: "/examlo-logo.svg",
    liveUrl: "https://examlo.app",
  },
];

