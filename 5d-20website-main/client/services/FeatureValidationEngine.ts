interface ValidationResult {
  isValid: boolean;
  depth: number;
  timestamp: Date;
  validationPath: string[];
  errors: string[];
  warnings: string[];
  performance: {
    duration: number;
    memoryUsage: number;
  };
}

interface DeepValidationConfig {
  maxDepth: number;
  timeout: number;
  retryCount: number;
  skipOnError: boolean;
  collectMetrics: boolean;
}

export class FeatureValidationEngine {
  private validationHistory: Map<string, ValidationResult[]> = new Map();
  private activeValidations: Set<string> = new Set();
  private config: DeepValidationConfig;

  constructor(config?: Partial<DeepValidationConfig>) {
    this.config = {
      maxDepth: 1000,
      timeout: 30000, // 30 seconds
      retryCount: 3,
      skipOnError: false,
      collectMetrics: true,
      ...config,
    };
  }

  public async validateFeatureDeep(
    featureId: string,
    validationMethod: () => Promise<boolean>,
    dependencyChain: string[] = [],
    currentDepth: number = 0,
  ): Promise<ValidationResult> {
    const startTime = performance.now();
    const validationPath = [...dependencyChain, featureId];

    // Prevent infinite recursion
    if (currentDepth >= this.config.maxDepth) {
      return {
        isValid: false,
        depth: currentDepth,
        timestamp: new Date(),
        validationPath,
        errors: [`Maximum depth ${this.config.maxDepth} exceeded`],
        warnings: [],
        performance: {
          duration: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
        },
      };
    }

    // Prevent circular dependencies
    if (dependencyChain.includes(featureId)) {
      return {
        isValid: false,
        depth: currentDepth,
        timestamp: new Date(),
        validationPath,
        errors: [
          `Circular dependency detected: ${validationPath.join(" -> ")}`,
        ],
        warnings: [],
        performance: {
          duration: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
        },
      };
    }

    // Check if already validating
    if (this.activeValidations.has(featureId)) {
      return {
        isValid: false,
        depth: currentDepth,
        timestamp: new Date(),
        validationPath,
        errors: ["Validation already in progress"],
        warnings: [],
        performance: {
          duration: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
        },
      };
    }

    this.activeValidations.add(featureId);

    try {
      const result = await this.performDeepValidation(
        featureId,
        validationMethod,
        validationPath,
        currentDepth,
        startTime,
      );

      // Store validation history
      if (!this.validationHistory.has(featureId)) {
        this.validationHistory.set(featureId, []);
      }
      const history = this.validationHistory.get(featureId)!;
      history.push(result);

      // Keep only last 100 validations per feature
      if (history.length > 100) {
        history.shift();
      }

      return result;
    } finally {
      this.activeValidations.delete(featureId);
    }
  }

  private async performDeepValidation(
    featureId: string,
    validationMethod: () => Promise<boolean>,
    validationPath: string[],
    currentDepth: number,
    startTime: number,
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Level 1: Basic validation
      const basicResult = await this.withTimeout(
        validationMethod(),
        this.config.timeout,
      );

      if (!basicResult) {
        errors.push("Basic validation failed");
      }

      // Level 2: DOM integrity check
      const domResult = await this.validateDOMIntegrity(featureId);
      if (!domResult.isValid) {
        errors.push(...domResult.errors);
        warnings.push(...domResult.warnings);
      }

      // Level 3: Event handling validation
      const eventResult = await this.validateEventHandling(featureId);
      if (!eventResult.isValid) {
        errors.push(...eventResult.errors);
        warnings.push(...eventResult.warnings);
      }

      // Level 4: Performance validation
      const perfResult = await this.validatePerformance(featureId);
      if (!perfResult.isValid) {
        errors.push(...perfResult.errors);
        warnings.push(...perfResult.warnings);
      }

      // Level 5: Accessibility validation
      const a11yResult = await this.validateAccessibility(featureId);
      if (!a11yResult.isValid) {
        errors.push(...a11yResult.errors);
        warnings.push(...a11yResult.warnings);
      }

      // Level 6: Security validation
      const securityResult = await this.validateSecurity(featureId);
      if (!securityResult.isValid) {
        errors.push(...securityResult.errors);
        warnings.push(...securityResult.warnings);
      }

      // Level 7: Data consistency validation
      const dataResult = await this.validateDataConsistency(featureId);
      if (!dataResult.isValid) {
        errors.push(...dataResult.errors);
        warnings.push(...dataResult.warnings);
      }

      // Level 8: Network dependency validation
      const networkResult = await this.validateNetworkDependencies(featureId);
      if (!networkResult.isValid) {
        errors.push(...networkResult.errors);
        warnings.push(...networkResult.warnings);
      }

      // Level 9: State management validation
      const stateResult = await this.validateStateManagement(featureId);
      if (!stateResult.isValid) {
        errors.push(...stateResult.errors);
        warnings.push(...stateResult.warnings);
      }

      // Level 10: Integration validation (recursive depth)
      if (currentDepth < this.config.maxDepth - 1) {
        const integrationResult = await this.validateIntegrations(
          featureId,
          validationPath,
          currentDepth + 1,
        );
        if (!integrationResult.isValid) {
          errors.push(...integrationResult.errors);
          warnings.push(...integrationResult.warnings);
        }
      }

      const isValid = basicResult && errors.length === 0;

      return {
        isValid,
        depth: currentDepth,
        timestamp: new Date(),
        validationPath,
        errors,
        warnings,
        performance: {
          duration: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
        },
      };
    } catch (error) {
      return {
        isValid: false,
        depth: currentDepth,
        timestamp: new Date(),
        validationPath,
        errors: [`Validation error: ${error}`],
        warnings,
        performance: {
          duration: performance.now() - startTime,
          memoryUsage: this.getMemoryUsage(),
        },
      };
    }
  }

  private async validateDOMIntegrity(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for element existence
      const elements = document.querySelectorAll(
        `[data-feature="${featureId}"]`,
      );
      if (elements.length === 0) {
        warnings.push(`No DOM elements found for feature ${featureId}`);
      }

      // Check for broken selectors
      const invalidSelectors = document.querySelectorAll("[class*=':']");
      if (invalidSelectors.length > 0) {
        warnings.push(
          `Found ${invalidSelectors.length} potentially invalid CSS selectors`,
        );
      }

      // Check for orphaned elements
      const orphanedElements = document.querySelectorAll(
        "[data-testid]:not([data-feature])",
      );
      if (orphanedElements.length > 0) {
        warnings.push(
          `Found ${orphanedElements.length} orphaned test elements`,
        );
      }

      // Check for duplicate IDs
      const allIds = Array.from(document.querySelectorAll("[id]")).map(
        (el) => el.id,
      );
      const duplicateIds = allIds.filter(
        (id, index) => allIds.indexOf(id) !== index,
      );
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate IDs found: ${duplicateIds.join(", ")}`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`DOM integrity check failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateEventHandling(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for unbound event listeners
      const clickableElements = document.querySelectorAll(
        "button, a, [onclick], [role='button']",
      );
      let unboundCount = 0;

      clickableElements.forEach((element) => {
        const hasClickHandler =
          element.onclick ||
          element.addEventListener ||
          element.getAttribute("onclick");
        if (!hasClickHandler) {
          unboundCount++;
        }
      });

      if (unboundCount > 0) {
        warnings.push(
          `${unboundCount} clickable elements without event handlers`,
        );
      }

      // Check for form validation
      const forms = document.querySelectorAll("form");
      forms.forEach((form, index) => {
        if (!form.onsubmit && !form.noValidate) {
          warnings.push(`Form ${index} lacks validation`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Event handling validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validatePerformance(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check memory usage
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage > 100 * 1024 * 1024) {
        // 100MB
        warnings.push(
          `High memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        );
      }

      // Check for large DOM
      const elementCount = document.querySelectorAll("*").length;
      if (elementCount > 5000) {
        warnings.push(`Large DOM: ${elementCount} elements`);
      }

      // Check for render blocking resources
      const scripts = document.querySelectorAll(
        "script:not([async]):not([defer])",
      );
      if (scripts.length > 5) {
        warnings.push(`${scripts.length} render-blocking scripts`);
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Performance validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateAccessibility(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for missing alt attributes
      const images = document.querySelectorAll("img:not([alt])");
      if (images.length > 0) {
        warnings.push(`${images.length} images missing alt attributes`);
      }

      // Check for missing labels
      const inputs = document.querySelectorAll(
        "input:not([aria-label]):not([aria-labelledby])",
      );
      const inputsWithoutLabels = Array.from(inputs).filter((input) => {
        const id = input.getAttribute("id");
        return !id || !document.querySelector(`label[for="${id}"]`);
      });

      if (inputsWithoutLabels.length > 0) {
        warnings.push(`${inputsWithoutLabels.length} inputs missing labels`);
      }

      // Check for missing heading hierarchy
      const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
      if (headings.length === 0) {
        warnings.push("No heading elements found");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Accessibility validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateSecurity(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for inline scripts
      const inlineScripts = document.querySelectorAll("script:not([src])");
      if (inlineScripts.length > 0) {
        warnings.push(`${inlineScripts.length} inline scripts found`);
      }

      // Check for eval usage in global scope
      if (window.eval && typeof window.eval === "function") {
        warnings.push("eval function is available globally");
      }

      // Check for exposed sensitive data in localStorage
      const sensitiveKeys = ["password", "token", "secret", "key"];
      const exposedData = sensitiveKeys.filter((key) =>
        Object.keys(localStorage).some((lsKey) =>
          lsKey.toLowerCase().includes(key),
        ),
      );

      if (exposedData.length > 0) {
        errors.push(
          `Sensitive data in localStorage: ${exposedData.join(", ")}`,
        );
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Security validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateDataConsistency(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check localStorage consistency
      const cartData = localStorage.getItem("cart");
      const favoritesData = localStorage.getItem("favorites");

      if (cartData) {
        try {
          JSON.parse(cartData);
        } catch {
          errors.push("Invalid cart data in localStorage");
        }
      }

      if (favoritesData) {
        try {
          JSON.parse(favoritesData);
        } catch {
          errors.push("Invalid favorites data in localStorage");
        }
      }

      // Check for data attribute consistency
      const productElements = document.querySelectorAll("[data-product-id]");
      productElements.forEach((element, index) => {
        const productId = element.getAttribute("data-product-id");
        if (!productId || productId.trim() === "") {
          warnings.push(`Product element ${index} has empty product ID`);
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Data consistency validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateNetworkDependencies(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for broken image sources
      const images = document.querySelectorAll("img");
      for (const img of images) {
        if (img.naturalWidth === 0 && img.complete) {
          warnings.push(`Broken image: ${img.src}`);
        }
      }

      // Check for failed CSS loads
      const stylesheets = document.querySelectorAll("link[rel='stylesheet']");
      for (const link of stylesheets) {
        // Basic check - in a real implementation you'd want to verify loading
        if (!link.href) {
          warnings.push("Stylesheet with empty href");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Network dependencies validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateStateManagement(
    featureId: string,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check for state consistency between localStorage and DOM
      const cartCount =
        document.querySelector("[data-cart-count]")?.textContent;
      const cartData = localStorage.getItem("cart");

      if (cartData && cartCount) {
        try {
          const cart = JSON.parse(cartData);
          const actualCount = Array.isArray(cart) ? cart.length : 0;
          const displayedCount = parseInt(cartCount) || 0;

          if (actualCount !== displayedCount) {
            errors.push(
              `Cart count mismatch: displayed ${displayedCount}, actual ${actualCount}`,
            );
          }
        } catch {
          warnings.push("Could not validate cart state consistency");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`State management validation failed: ${error}`],
        warnings,
      };
    }
  }

  private async validateIntegrations(
    featureId: string,
    validationPath: string[],
    currentDepth: number,
  ): Promise<{ isValid: boolean; errors: string[]; warnings: string[] }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Recursively validate related features up to maxDepth
      const relatedFeatures = this.getRelatedFeatures(featureId);

      for (const relatedFeature of relatedFeatures) {
        if (currentDepth < this.config.maxDepth) {
          const relatedResult = await this.validateFeatureDeep(
            relatedFeature.id,
            relatedFeature.validationMethod,
            validationPath,
            currentDepth,
          );

          if (!relatedResult.isValid) {
            warnings.push(
              `Related feature ${relatedFeature.id} validation failed`,
            );
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [`Integration validation failed: ${error}`],
        warnings,
      };
    }
  }

  private getRelatedFeatures(featureId: string): Array<{
    id: string;
    validationMethod: () => Promise<boolean>;
  }> {
    // This would integrate with the RecursiveMemorySystem to get related features
    // For now, return empty array to prevent infinite recursion
    return [];
  }

  private async withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error("Validation timeout")), timeout),
      ),
    ]);
  }

  private getMemoryUsage(): number {
    if ((performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  public getValidationHistory(featureId: string): ValidationResult[] {
    return this.validationHistory.get(featureId) || [];
  }

  public getValidationSummary(): {
    totalValidations: number;
    averageDepth: number;
    errorRate: number;
    averageDuration: number;
  } {
    const allResults = Array.from(this.validationHistory.values()).flat();

    if (allResults.length === 0) {
      return {
        totalValidations: 0,
        averageDepth: 0,
        errorRate: 0,
        averageDuration: 0,
      };
    }

    const totalValidations = allResults.length;
    const averageDepth =
      allResults.reduce((sum, r) => sum + r.depth, 0) / totalValidations;
    const errorRate =
      allResults.filter((r) => !r.isValid).length / totalValidations;
    const averageDuration =
      allResults.reduce((sum, r) => sum + r.performance.duration, 0) /
      totalValidations;

    return {
      totalValidations,
      averageDepth,
      errorRate,
      averageDuration,
    };
  }

  public clearHistory(): void {
    this.validationHistory.clear();
  }
}

export const featureValidationEngine = new FeatureValidationEngine();
