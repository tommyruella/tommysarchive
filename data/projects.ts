import { ProjectMetadata, WorkstationProject, ProjectStill } from "@/types/project";
import scannedStillsRecord from "./scanned-stills.json";

const scannedStills = scannedStillsRecord as Record<string, string[]>;

/**
 * Clean project metadata definitions.
 * Stills are indexed dynamically from public/projects/<slug> (including subfolders).
 * You never need to manually write stills or rename files here!
 */
export const PROJECTS_METADATA: ProjectMetadata[] = [
  {
    id: "01",
    slug: "london",
    title: "London March '26",
    year: "2026",
    category: "Vlog",
    typeLabel: "Vlog Recap Londra",
    role: "Riprese, Edit & Color",
    duration: "02:07 Min",
    timecode: "00:02:07:00",
    clipColor: "navy",
    synopsis: "Video recap personale del viaggio a Londra.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/KyG3RiIU38A",
      youtubeId: "KyG3RiIU38A",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      camera: "Sony a6700",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/KyG3RiIU38A?si=1zMM8z3WxESqM4gD" },
    ],
    timelineWeight: 1.0,
  },
  {
    id: "02",
    slug: "barca-2",
    title: "Barça July '25",
    year: "2025",
    category: "Vlog",
    typeLabel: "Vlog Recap Barcellona '25",
    role: "Riprese, Edit & Color",
    duration: "01:07 Min",
    timecode: "00:01:07:00",
    clipColor: "navy",
    synopsis: "Breve video recap personale di 3 giorni a Barcellona ad agosto 2025.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/xPzrwrbP5tg",
      youtubeId: "xPzrwrbP5tg",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      camera: "iPhone 11",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/xPzrwrbP5tg?si=zUuO073lspNEAHMs" },
    ],
    timelineWeight: 0.9,
  },
  {
    id: "03",
    slug: "ctrl-z",
    title: "CTRL+Z",
    year: "2025",
    category: "INTERATTIVO",
    typeLabel: "ARG & Web App",
    role: "Front-end React, Edit & Color",
    duration: "Web & Video",
    timecode: "00:05:27:00",
    clipColor: "orange",
    synopsis:
      "ARG (progetto transmediale) a cui ho contribuito durante gli studi. Ho sviluppato il front-end in React di una web-app e ho contribuito al video di presentazione/gameplay, occupandomi di montaggio e color.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/QfKeIw0iED8",
      youtubeId: "QfKeIw0iED8",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      frontend: "React · Next.js",
      camera: "iPhone 15 Pro",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    credits: [
      { role: "Team", name: "Filippo Brusco, Alice Buccoleri, Francesco Lauriola, Tommaso Ruella" },
    ],
    links: [
      { label: "Sito Atelier 35", url: "https://atelier35.vercel.app" },
      { label: "Guarda su YT", url: "https://youtu.be/QfKeIw0iED8?si=XnnDku-6U_iqd0EP" },
    ],
    timelineWeight: 1.1,
  },
  {
    id: "04",
    slug: "hobbiton",
    title: "Hobbiton",
    year: "2025",
    category: "3D",
    typeLabel: "Computer Grafica 3D",
    role: "3D Modeling & Texturing",
    duration: "3D Scene",
    timecode: "00:00:00:00",
    clipColor: "green",
    synopsis:
      "Progetto di gruppo per il corso di Computer Grafica: una replica della Hobbiton House, il più possibile fedele all'originale ma arricchita con elementi inediti ed easter egg. Il lavoro è stato diviso per la realizzazione e texturizzazione dei singoli oggetti in Blender e Substance Painter, poi uniti nel file master finale.",
    primaryMedia: {
      type: "image",
      aspectRatio: "landscape",
    },
    technicalSpecs: {
      software: "Blender · Substance Painter",
    },
    credits: [
      { role: "Team", name: "Filippo Brusco, Francesco Lauriola, Matteo Berga, Matteo Putzolu, Tommaso Ruella" },
    ],
    links: [],
    timelineWeight: 1.0,
  },
  {
    id: "05",
    slug: "timeless",
    title: "Timeless",
    year: "2024",
    category: "FILM",
    typeLabel: "Cortometraggio",
    role: "Edit & Color, VFX",
    duration: "05:57 Min",
    timecode: "00:05:57:00",
    clipColor: "red",
    synopsis:
      "Cortometraggio realizzato durante il percorso di studi al Politecnico di Torino. Mi sono occupato di edit e color, più alcuni VFX. È stato il mio primo vero progetto professionale e ne ho curato interamente la post-produzione, compresi montaggio e color.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/qYS8iPHcGdU?si=Cre4uemdXb47Rs52",
      youtubeId: "qYS8iPHcGdU",
      poster: "https://img.youtube.com/vi/qYS8iPHcGdU/maxresdefault.jpg",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      camera: "Cinema Rig",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    credits: [
      { role: "Produzione", name: "Marco Russo" },
      { role: "Regia", name: "Ennio Montenero" },
      { role: "Sceneggiatura", name: "Francesco Nicolosi" },
      { role: "Fotografia", name: "Francesca Mongiò" },
      { role: "Suono", name: "Sebastiano Pasquero" },
      { role: "Edit & Color", name: "Tommaso Ruella e Marco Russo" },
    ],
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/qYS8iPHcGdU?si=Cre4uemdXb47Rs52" },
    ],
    timelineWeight: 1.3,
  },
  {
    id: "06",
    slug: "donut-in-turin",
    title: "Donut in Turin",
    year: "2024",
    category: "3D",
    typeLabel: "Animazione 3D Blender",
    role: "3D Modeling & Animation",
    duration: "Shorts",
    timecode: "00:00:5:00",
    clipColor: "green",
    synopsis: "Animazione realizzata su Blender.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/pV4sw1oza5c",
      youtubeId: "pV4sw1oza5c",
      aspectRatio: "portrait",
    },
    technicalSpecs: {
      software: "Blender 3D",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtube.com/shorts/pV4sw1oza5c?si=nVG5LPd2H2wohRaG" },
    ],
    timelineWeight: 0.9,
  },
  {
    id: "07",
    slug: "esothia",
    title: "Esothia",
    year: "2024",
    category: "INTERATTIVO",
    typeLabel: "Installazione & Trailer",
    role: "Sound Design & VFX",
    duration: "Trailer",
    timecode: "00:03:36:00",
    clipColor: "orange",
    synopsis:
      "Progetto interattivo realizzato durante il percorso di studi al Politecnico di Torino. Mi sono occupato del sound design dell'installazione e del relativo trailer, per cui ho realizzato anche alcuni VFX e i vari titoli e caption.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/LksrRu6uEtg",
      youtubeId: "LksrRu6uEtg",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      software: "DaVinci Resolve, Blender, Isadora",
    },
    credits: [
      { role: "Visual & Edit", name: "Lorenzo Lamanna e Mila Maksimovic" },
      { role: "Sound Design", name: "Elisa Turco e Tommaso Ruella" },
      { role: "3D Artist", name: "Marco Russo" },
      { role: "VFX & Motion", name: "Tommaso Ruella" },
      { role: "Isadora", name: "Alessandro Pulitano e Davide Moldoveanu" },
    ],
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/LksrRu6uEtg?si=nqqJMaKHpM8bZWzx" },
    ],
    timelineWeight: 1.1,
  },
  {
    id: "08",
    slug: "logo-animation",
    title: "Logo Animation",
    year: "2024",
    category: "3D MOTION",
    typeLabel: "Motion Design 3D",
    role: "3D Animation",
    duration: "Reveal",
    timecode: "00:00:10:00",
    clipColor: "green",
    synopsis: "Breve animazione e logo reveal realizzati su Blender.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/wBEbZQBo4c4",
      youtubeId: "wBEbZQBo4c4",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      software: "Blender 3D, After Effects",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/wBEbZQBo4c4?si=CKa6kGCPma4TjKu0" },
    ],
    timelineWeight: 1.0,
  },
  {
    id: "09",
    slug: "set-23-barca",
    title: "Barça Set '23",
    year: "2023",
    category: "Vlog",
    typeLabel: "Vlog Recap Barcellona '23",
    role: "Riprese, Edit & Color",
    duration: "02:14 Min",
    timecode: "00:02:14:00",
    clipColor: "navy",
    synopsis: "Recap personale di 3 giorni a Barcellona a settembre 2023.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/yGgGy4eZROk",
      youtubeId: "yGgGy4eZROk",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      camera: "iPhone 11",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/yGgGy4eZROk?si=VRibEJspvebVTDio" },
    ],
    timelineWeight: 1.0,
  },
  {
    id: "10",
    slug: "valencia",
    title: "Valencia April '23",
    year: "2023",
    category: "Vlog",
    typeLabel: "Vlog Recap Valencia",
    role: "Riprese, Edit & Color",
    duration: "01:52 Min",
    timecode: "00:01:52:00",
    clipColor: "navy",
    synopsis: "Video recap personale del viaggio a Valencia.",
    primaryMedia: {
      type: "video",
      src: "https://youtu.be/MgAYgd2AYT4?si=A5tHbElFPxYZ1mzJ",
      youtubeId: "MgAYgd2AYT4",
      aspectRatio: "wide",
    },
    technicalSpecs: {
      camera: "iPhone 11",
      software: "DaVinci Resolve",
      colorGrade: "DaVinci Resolve",
    },
    links: [
      { label: "Guarda su YT", url: "https://youtu.be/MgAYgd2AYT4?si=A5tHbElFPxYZ1mzJ" },
    ],
    timelineWeight: 0.9,
  },
  {
    id: "11",
    slug: "recent-works-foto",
    title: "Recent Photos",
    year: "2024–2026",
    category: "PHOTO",
    typeLabel: "Selezione Fotografica",
    role: "Fotografia & Color",
    clipColor: "purple",
    synopsis:
      "Selezione curata di reportage e progetti di scatto (Londra '26, Madrid '26 e motorsport).",
    primaryMedia: {
      type: "image",
      aspectRatio: "portrait",
    },
    technicalSpecs: {
      camera: "Sony α6700 · Fujifilm",
      software: "Lightroom · DaVinci Resolve",
      colorGrade: "Custom Film Print Emulation",
    },
    credits: [
      { role: "Fotografia", name: "Tommaso Ruella" },
      { role: "Color Grading", name: "Tommaso Ruella" },
    ],
    links: [],
    timelineWeight: 1.0,
  },
];

const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_MEDIA_URL || "").replace(/\/+$/, "");

/**
 * Resolves a media URL:
 * - If it's an absolute HTTP/HTTPS URL, returns it unchanged.
 * - If NEXT_PUBLIC_MEDIA_URL is set and the url starts with /projects/, redirects to the cloud bucket.
 * - Otherwise returns the relative path (local dev fallback).
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (MEDIA_BASE_URL && url.startsWith("/projects/")) {
    return `${MEDIA_BASE_URL}${url.slice("/projects".length)}`;
  }
  return url;
}

/**
 * Builds fully-resolved workstation projects by dynamically pairing metadata with scanned image assets.
 */
function buildWorkstationProjects(rawList: ProjectMetadata[]): WorkstationProject[] {
  return rawList.map((raw) => {
    const rawImages: string[] = scannedStills[raw.slug] || [];
    const images: string[] = rawImages.map(resolveMediaUrl);
    const isImageProject = raw.primaryMedia.type === "image";

    let resolvedPoster = raw.primaryMedia.poster ? resolveMediaUrl(raw.primaryMedia.poster) : "";
    let resolvedSrc = raw.primaryMedia.src ? resolveMediaUrl(raw.primaryMedia.src) : "";
    let resolvedStills: ProjectStill[] = [];

    if (isImageProject) {
      function parseSection(url: string, slug: string): string | undefined {
        const marker = `/${slug}/`;
        const idx = url.indexOf(marker);
        if (idx === -1) return undefined;
        const sub = url.slice(idx + marker.length);
        const parts = sub.split("/");
        if (parts.length > 1) {
          const rawSec = decodeURIComponent(parts[0]);
          return rawSec.replace(/^\d+[_-\s]*/, "").trim() || rawSec;
        }
        return undefined;
      }

      // For photography / image projects:
      // First image is the lead cover & source
      const leadImage = images[0] || resolvedPoster || "/projects/placeholder.png";
      resolvedPoster = resolvedPoster || leadImage;
      resolvedSrc = resolvedSrc || leadImage;

      // Index all images with their respective folder section metadata
      resolvedStills = images.map((imgUrl, idx) => ({
        id: `${raw.slug}-${String(idx + 1).padStart(2, "0")}`,
        url: imgUrl,
        section: parseSection(imgUrl, raw.slug),
      }));

      // Calculate dynamic count / duration for photo collections
      const totalCount = images.length;
      const dynamicDuration = raw.duration || `${totalCount} Scatti`;
      const dynamicTimecode = raw.timecode || `00:00:${String(totalCount).padStart(2, "0")}:00`;

      return {
        ...raw,
        duration: dynamicDuration,
        timecode: dynamicTimecode,
        primaryMedia: {
          ...raw.primaryMedia,
          src: resolvedSrc,
          poster: resolvedPoster,
        },
        stills: raw.stills && raw.stills.length > 0 ? raw.stills : resolvedStills,
      };
    } else {
      // For video projects:
      // 1. Look for a designated cover "00.*", "cover.*", or "poster.*" in the project folder
      const cover00 = images.find((img) => /\/(00|cover|poster)\.(png|jpe?g|webp|avif)$/i.test(img));

      if (cover00) {
        resolvedPoster = cover00;
        // All other images become stills
        const candidateImages = images.filter((img) => img !== cover00);
        resolvedStills = candidateImages.map((imgUrl, idx) => ({
          id: `${raw.slug}-${String(idx + 1).padStart(2, "0")}`,
          url: imgUrl,
        }));
      } else if (raw.primaryMedia.poster && raw.primaryMedia.poster.startsWith("http")) {
        // Explicit remote poster (e.g. YouTube maxresdefault)
        resolvedPoster = raw.primaryMedia.poster;
        // All local images are scene stills
        resolvedStills = images.map((imgUrl, idx) => ({
          id: `${raw.slug}-${String(idx + 1).padStart(2, "0")}`,
          url: imgUrl,
        }));
      } else if (images.length > 0) {
        // Local images without 00: first image is the cover
        resolvedPoster = images[0];
        // Remaining images (if any) are stills; if only 1 image (e.g. barca-2, valencia), stills is empty []
        const candidateImages = images.slice(1);
        resolvedStills = candidateImages.map((imgUrl, idx) => ({
          id: `${raw.slug}-${String(idx + 1).padStart(2, "0")}`,
          url: imgUrl,
        }));
      } else if (raw.primaryMedia.youtubeId) {
        resolvedPoster = `https://img.youtube.com/vi/${raw.primaryMedia.youtubeId}/maxresdefault.jpg`;
        resolvedStills = [];
      } else {
        resolvedPoster = "/projects/placeholder.png";
        resolvedStills = [];
      }

      resolvedSrc = raw.primaryMedia.src ? resolveMediaUrl(raw.primaryMedia.src) : resolvedPoster;

      return {
        ...raw,
        primaryMedia: {
          ...raw.primaryMedia,
          src: resolvedSrc,
          poster: resolvedPoster,
        },
        stills: raw.stills && raw.stills.length > 0 ? raw.stills : resolvedStills,
      };
    }
  });
}

export const WORKSTATION_PROJECTS: WorkstationProject[] = buildWorkstationProjects(PROJECTS_METADATA);

export default WORKSTATION_PROJECTS;
