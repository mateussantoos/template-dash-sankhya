import { toast } from "react-toastify";

type ExportFormat = "png" | "jpeg";

export interface ExportChartImageOptions {
  fileName?: string;
  format?: ExportFormat;
  backgroundColor?: string;
  scale?: number;
}

const DEFAULT_OPTIONS: Required<ExportChartImageOptions> = {
  fileName: "chart",
  format: "png",
  backgroundColor: "#ffffff",
  scale: typeof window !== "undefined" ? window.devicePixelRatio || 2 : 2,
};

function sanitizeFileName(name: string): string {
  if (!name) {
    return DEFAULT_OPTIONS.fileName;
  }
  return (
    name
      .replace(/[\\/:*?"<>|]+/g, "")
      .trim()
      .replace(/\s+/g, "-") || "chart"
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportCanvasElement(
  canvas: HTMLCanvasElement,
  options: Required<ExportChartImageOptions>
) {
  const mimeType = options.format === "jpeg" ? "image/jpeg" : "image/png";

  return new Promise<void>((resolve, reject) => {
    const exportCanvas =
      options.backgroundColor && options.backgroundColor !== "transparent"
        ? (() => {
            const tmpCanvas = document.createElement("canvas");
            tmpCanvas.width = canvas.width;
            tmpCanvas.height = canvas.height;
            const ctx = tmpCanvas.getContext("2d");
            if (!ctx) {
              reject(
                new Error("Não foi possível obter o contexto 2D do canvas.")
              );
              return canvas;
            }
            ctx.fillStyle = options.backgroundColor;
            ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
            ctx.drawImage(canvas, 0, 0);
            return tmpCanvas;
          })()
        : canvas;

    exportCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Falha ao gerar o blob do canvas."));
          return;
        }
        downloadBlob(
          blob,
          `${sanitizeFileName(options.fileName)}.${options.format}`
        );
        resolve();
      },
      mimeType,
      1
    );
  });
}

function exportSvgElement(
  svg: SVGSVGElement,
  options: Required<ExportChartImageOptions>
) {
  const { width, height } = svg.getBoundingClientRect();
  const exportWidth =
    width ||
    Number(svg.getAttribute("width")) ||
    svg.viewBox.baseVal.width ||
    800;
  const exportHeight =
    height ||
    Number(svg.getAttribute("height")) ||
    svg.viewBox.baseVal.height ||
    600;

  const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
  clonedSvg.setAttribute("width", `${exportWidth}`);
  clonedSvg.setAttribute("height", `${exportHeight}`);
  clonedSvg.setAttribute(
    "viewBox",
    svg.getAttribute("viewBox") ?? `0 0 ${exportWidth} ${exportHeight}`
  );

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const svgUrl = URL.createObjectURL(svgBlob);

  return new Promise<void>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = exportWidth * options.scale;
      canvas.height = exportHeight * options.scale;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        reject(new Error("Não foi possível obter o contexto 2D do canvas."));
        return;
      }

      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(svgUrl);
          if (!blob) {
            reject(new Error("Falha ao gerar o blob a partir do SVG."));
            return;
          }
          downloadBlob(
            blob,
            `${sanitizeFileName(options.fileName)}.${options.format}`
          );
          resolve();
        },
        options.format === "jpeg" ? "image/jpeg" : "image/png",
        1
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error("Não foi possível converter o SVG em imagem."));
    };

    image.src = svgUrl;
  });
}

/**
 * Exporta um gráfico renderizado dentro de um `ChartCard` como imagem (PNG ou JPEG).
 */
export async function exportChartAsImage(
  element: HTMLElement | null,
  options: ExportChartImageOptions = {}
) {
  if (!element) {
    toast.error("Erro ao exportar gráfico: elemento não encontrado.");
    return;
  }

  const mergedOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
    fileName: sanitizeFileName(options.fileName ?? DEFAULT_OPTIONS.fileName),
  };

  try {
    const canvas = element.querySelector("canvas");
    if (canvas instanceof HTMLCanvasElement) {
      await exportCanvasElement(canvas, mergedOptions);
      toast.success("Gráfico exportado com sucesso!");
      return;
    }

    const svg = element.querySelector("svg");
    if (svg instanceof SVGSVGElement) {
      await exportSvgElement(svg, mergedOptions);
      toast.success("Gráfico exportado com sucesso!");
      return;
    }

    toast.error(
      "Não foi encontrado um elemento <canvas> ou <svg> dentro do container informado."
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erro desconhecido ao exportar o gráfico.";
    toast.error(`Erro ao exportar gráfico: ${errorMessage}`);
  }
}
