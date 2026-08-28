import type { NextConfig } from "next";
import os from "node:os";
import path from "node:path";
import { Module } from "node:module";

// Next's generated server bundle lives outside the project so it cannot find
// dependencies by walking up from that temporary directory. Make the local
// dependency directory available to the build workers and generated server.
process.env.NODE_PATH = path.join(process.cwd(), "node_modules");
(Module as unknown as { _initPaths: () => void })._initPaths();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep all generated output outside OneDrive. OneDrive marks files anywhere
  // inside this synced workspace as reparse points, which breaks Next's
  // manifest, diagnostics, and server-file reads with EINVAL.
  // Vercel must keep the manifest inside its checkout; local OneDrive builds
  // use a temp directory to avoid reparse-point readlink failures.
  distDir: process.env.VERCEL === "1"
    ? ".next"
    : path.relative(
        process.cwd(),
        path.join(os.tmpdir(), "tutorfinder-next-build")
      ),
};

export default nextConfig;
