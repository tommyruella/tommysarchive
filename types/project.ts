export type MediaAspectRatio = "portrait" | "landscape" | "wide" | "square";

export type DaVinciClipColor = "navy" | "red" | "green" | "orange" | "purple" | "default";

export interface ProjectStill {
  id: string;
  url: string;
  caption?: string;
  aspectRatio?: MediaAspectRatio;
  meta?: string;
  section?: string;
}

export interface TechnicalSpecs {
  stock?: string;
  aspectRatio?: string;
  optics?: string;
  camera?: string;
  sound?: string;
  software?: string;
  processing?: string;
  colorGrade?: string;
  [key: string]: any;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectMetadata {
  id: string;
  slug: string;
  title: string;
  year: string;
  category: string;
  typeLabel: string;
  role: string;
  duration?: string;
  timecode?: string;
  synopsis: string;
  clipColor?: DaVinciClipColor;
  primaryMedia: {
    type: "video" | "image";
    src?: string;
    localVideo?: string;
    youtubeId?: string;
    poster?: string;
    aspectRatio?: MediaAspectRatio;
  };
  stills?: ProjectStill[];
  technicalSpecs?: TechnicalSpecs;
  credits?: ProjectCredit[];
  links: ProjectLink[];
  timelineWeight: number;
  hashCount?: number;
}

export interface WorkstationProject extends Omit<ProjectMetadata, "primaryMedia" | "stills"> {
  primaryMedia: {
    type: "video" | "image";
    src: string;
    localVideo?: string;
    youtubeId?: string;
    poster: string;
    aspectRatio?: MediaAspectRatio;
  };
  stills: ProjectStill[];
}
