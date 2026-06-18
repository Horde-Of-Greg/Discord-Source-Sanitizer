import path from "node:path";

class RepoPaths {
    readonly projectDir = path.join(import.meta.dirname, "..");
    readonly repoDir = path.join(this.projectDir, "..");
    readonly dataDir = path.join(this.repoDir, "data");
    readonly filterDir = path.join(this.dataDir, "filters");
    readonly ublockLikeFilterDir = path.join(this.filterDir, "ublock-like");
}

export const repoPaths = new RepoPaths();
