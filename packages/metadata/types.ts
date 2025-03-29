export interface PackageManifest {
  name: string;
  display: string;
  description?: string;
  author?: string;
}

export interface HooksFunction {
  name: string;
  package: string;
  lastUpdate?: number;
  description?: string;
  docs?: string;
  component?: boolean;
  directive?: boolean;
}
export interface HooksPackage extends PackageManifest {
  dir: string;
  docs?: string;
}
export interface PackageIndexes {
  packages: Record<string, HooksPackage>;
  functions: HooksFunction[];
}
