import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import path from "node:path";

const featureBoundariesPlugin = {
    rules: {
        "feature-boundaries": {
            meta: {
                type: "problem",
                messages: {
                    deepImport:
                        "Deep imports into features are not allowed. Import from '@/features/{{featureName}}' or '@/features/{{featureName}}/server' instead.",
                },
            },
            create(context) {
                function checkSource(node) {
                    if (!node || !node.source || !node.source.value) return;
                    const importPath = node.source.value;
                    const currentFile =
                        context.filename || context.getPhysicalFilename();
                    const posixCurrentFile = currentFile
                        .split(path.sep)
                        .join("/");

                    let targetFeatureName = null;
                    let isDeepImport = false;

                    if (importPath.startsWith("@/features/")) {
                        const parts = importPath
                            .replace("@/features/", "")
                            .split("/");
                        targetFeatureName = parts[0];
                        if (
                            parts.length > 1 &&
                            parts[1] !== "" &&
                            !parts[1].startsWith("index") &&
                            parts[1] !== "server"
                        ) {
                            isDeepImport = true;
                        }
                    } else if (importPath.startsWith(".")) {
                        const currentDir = path.dirname(posixCurrentFile);
                        let resolvedPath = path
                            .resolve(currentDir, importPath)
                            .split(path.sep)
                            .join("/");
                        const featuresDirIndex =
                            resolvedPath.lastIndexOf("/features/");

                        if (featuresDirIndex !== -1) {
                            const subPath = resolvedPath.slice(
                                featuresDirIndex + "/features/".length,
                            );
                            const parts = subPath.split("/");
                            targetFeatureName = parts[0];
                            if (
                                parts.length > 1 &&
                                parts[1] !== "" &&
                                !parts[1].startsWith("index") &&
                                parts[1] !== "server"
                            ) {
                                isDeepImport = true;
                            }
                        }
                    }

                    if (isDeepImport && targetFeatureName) {
                        const currentFeaturePattern = `/features/${targetFeatureName}/`;
                        if (!posixCurrentFile.includes(currentFeaturePattern)) {
                            context.report({
                                node,
                                messageId: "deepImport",
                                data: { featureName: targetFeatureName },
                            });
                        }
                    }
                }

                return {
                    ImportDeclaration: checkSource,
                    ExportNamedDeclaration: checkSource,
                    ExportAllDeclaration: checkSource,
                };
            },
        },
    },
};

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    // Override default ignores of eslint-config-next.
    globalIgnores([
        // Default ignores of eslint-config-next:
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    {
        plugins: {
            features: featureBoundariesPlugin,
        },
        rules: {
            "features/feature-boundaries": "error",
        },
    },
]);

export default eslintConfig;
