/**
 * Sales Share and Payback Service with AI Management
 * Handles revenue sharing, payback agreements, and contract enforcement
 */

interface PaybackAgreement {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  saleAmount: number;
  paybackPercentage: number;
  paybackAmount: number;
  contractTerms: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "defaulted" | "transferred";
  sourcingInfo: SourcingInfo;
  salesHistory: SaleRecord[];
  contractHash: string;
  aiReserveContribution: number; // 1 cent per sale
  seasonalMemberBenefits: boolean;
}

interface SourcingInfo {
  originalCost: number;
  supplier: string;
  purchaseDate: string;
  receipts: string[];
  authenticity: string;
  condition: string;
  marketValue: number;
}

interface SaleRecord {
  id: string;
  saleDate: string;
  amount: number;
  buyerId: string;
  paybackDue: number;
  aiReserve: number;
  status: "pending" | "paid" | "overdue";
  paymentDate?: string;
}

interface ContractTemplate {
  id: string;
  name: string;
  terms: string;
  defaultPaybackPercentage: number;
  gracePeriodDays: number;
  penaltyRate: number;
  transferConditions: string;
}

interface AIReservePool {
  totalAmount: number;
  contributions: Array<{
    saleId: string;
    amount: number;
    date: string;
  }>;
  disbursements: Array<{
    userId: string;
    amount: number;
    reason: string;
    date: string;
  }>;
}

class SalesSharePaybackServiceClass {
  private agreements: Map<string, PaybackAgreement> = new Map();
  private contracts: Map<string, ContractTemplate> = new Map();
  private aiReservePool: AIReservePool = {
    totalAmount: 0,
    contributions: [],
    disbursements: [],
  };

  constructor() {
    this.initializeContractTemplates();
    this.loadSavedData();
    this.startPaymentMonitoring();
  }

  /**
   * Initialize contract templates
   */
  private initializeContractTemplates(): void {
    const templates: ContractTemplate[] = [
      {
        id: "standard-resale",
        name: "Standard Resale Agreement",
        terms: `
RESALE PARTNERSHIP AGREEMENT

This agreement allows the User to list and sell items on the platform with revenue sharing.

TERMS:
1. User provides item details, sourcing information, and proof of ownership
2. Platform facilitates sale and marketing
3. Upon sale, User receives agreed percentage, Platform retains remainder
4. 1 cent per sale contributed to AI Reserve Pool for market stabilization
5. Payment due within 30 days of sale completion
6. Failure to pay results in item ownership transfer to Platform
7. Seasonal members receive enhanced resale privileges

PAYMENT SCHEDULE:
- Payment due: 30 days after sale
- Grace period: 7 days
- Penalty rate: 2% per week overdue
- Transfer trigger: 60 days overdue

AI RESERVE CONTRIBUTION:
- $0.01 per sale automatically reserved
- Used for payment differences and sales incentives
- Encourages platform growth and user retention
        `,
        defaultPaybackPercentage: 70,
        gracePeriodDays: 7,
        penaltyRate: 0.02,
        transferConditions:
          "60 days overdue triggers automatic ownership transfer",
      },
      {
        id: "seasonal-member",
        name: "Seasonal Member Agreement",
        terms: `
SEASONAL MEMBER RESALE AGREEMENT

Enhanced terms for seasonal platform members.

ENHANCED BENEFITS:
1. Higher revenue share (80% vs 70%)
2. Extended payment terms (45 days vs 30 days)
3. Priority listing and marketing
4. Access to all item categories for resale
5. Reduced AI Reserve contribution (50% discount)
6. Advanced analytics and market insights

SEASONAL PRIVILEGES:
- Can resell any approved items
- Priority customer support
- Enhanced seller dashboard
- Market trend alerts
- Bulk listing capabilities
        `,
        defaultPaybackPercentage: 80,
        gracePeriodDays: 14,
        penaltyRate: 0.015,
        transferConditions:
          "90 days overdue triggers automatic ownership transfer",
      },
      {
        id: "consignment",
        name: "Consignment Agreement",
        terms: `
CONSIGNMENT PARTNERSHIP AGREEMENT

For high-value items requiring specialized handling.

TERMS:
1. Platform takes physical custody of item
2. Professional photography and marketing
3. Authentication and condition verification
4. Insurance coverage during consignment period
5. Higher revenue share due to platform investment
6. Extended marketing period (up to 120 days)

PAYMENT TERMS:
- Payment due: 14 days after sale
- Higher penalties for default due to platform investment
- Immediate transfer upon payment default
        `,
        defaultPaybackPercentage: 60,
        gracePeriodDays: 3,
        penaltyRate: 0.05,
        transferConditions: "Immediate transfer upon payment default",
      },
    ];

    templates.forEach((template) => {
      this.contracts.set(template.id, template);
    });
  }

  /**
   * Create new payback agreement
   */
  async createPaybackAgreement(
    userId: string,
    itemId: string,
    itemName: string,
    saleAmount: number,
    contractType: string = "standard-resale",
    sourcingInfo: SourcingInfo,
    customTerms?: Partial<PaybackAgreement>,
  ): Promise<PaybackAgreement> {
    const contract = this.contracts.get(contractType);
    if (!contract) {
      throw new Error(`Contract template not found: ${contractType}`);
    }

    // Check if user is seasonal member
    const isSeasonalMember = await this.checkSeasonalMembership(userId);
    const selectedContract = isSeasonalMember
      ? this.contracts.get("seasonal-member") || contract
      : contract;

    const agreement: PaybackAgreement = {
      id: `agreement-${Date.now()}-${userId}`,
      userId,
      itemId,
      itemName,
      saleAmount,
      paybackPercentage:
        customTerms?.paybackPercentage ||
        selectedContract.defaultPaybackPercentage,
      paybackAmount: 0, // Calculated on sale
      contractTerms: selectedContract.terms,
      startDate: new Date().toISOString(),
      status: "active",
      sourcingInfo,
      salesHistory: [],
      contractHash: await this.generateContractHash(
        selectedContract.terms,
        userId,
        itemId,
      ),
      aiReserveContribution: isSeasonalMember ? 0.005 : 0.01, // 0.5 cents for seasonal members
      seasonalMemberBenefits: isSeasonalMember,
      ...customTerms,
    };

    this.agreements.set(agreement.id, agreement);
    this.saveAgreements();

    // Log contract creation
    console.log(`📝 Contract created: ${agreement.id} for user ${userId}`);

    return agreement;
  }

  /**
   * Process sale and update agreement
   */
  async processSale(
    agreementId: string,
    buyerId: string,
    saleAmount: number,
  ): Promise<SaleRecord> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) {
      throw new Error(`Agreement not found: ${agreementId}`);
    }

    // Calculate amounts
    const paybackDue = saleAmount * (agreement.paybackPercentage / 100);
    const aiReserve = agreement.aiReserveContribution;
    const platformShare = saleAmount - paybackDue - aiReserve;

    // Create sale record
    const saleRecord: SaleRecord = {
      id: `sale-${Date.now()}`,
      saleDate: new Date().toISOString(),
      amount: saleAmount,
      buyerId,
      paybackDue,
      aiReserve,
      status: "pending",
    };

    // Update agreement
    agreement.salesHistory.push(saleRecord);
    agreement.paybackAmount += paybackDue;

    // Add to AI reserve pool
    this.aiReservePool.totalAmount += aiReserve;
    this.aiReservePool.contributions.push({
      saleId: saleRecord.id,
      amount: aiReserve,
      date: new Date().toISOString(),
    });

    this.agreements.set(agreementId, agreement);
    this.saveAgreements();
    this.saveAIReservePool();

    console.log(
      `💰 Sale processed: $${saleAmount}, Payback due: $${paybackDue}, AI Reserve: $${aiReserve}`,
    );

    return saleRecord;
  }

  /**
   * Check payment status and handle overdue accounts
   */
  async checkPaymentStatus(agreementId: string): Promise<{
    status: string;
    daysOverdue: number;
    action: string;
  }> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) {
      throw new Error(`Agreement not found: ${agreementId}`);
    }

    const contract = Array.from(this.contracts.values()).find((c) =>
      agreement.contractTerms.includes(c.name),
    );

    if (!contract) {
      throw new Error("Contract template not found");
    }

    // Check each unpaid sale
    for (const sale of agreement.salesHistory) {
      if (sale.status === "pending") {
        const daysSinceSale = Math.floor(
          (Date.now() - new Date(sale.saleDate).getTime()) /
            (24 * 60 * 60 * 1000),
        );

        const paymentDue = 30; // Standard payment period
        const gracePeriod = contract.gracePeriodDays;

        if (daysSinceSale > paymentDue + gracePeriod) {
          // Payment is overdue
          const daysOverdue = daysSinceSale - paymentDue - gracePeriod;

          if (daysOverdue >= 60 && !agreement.seasonalMemberBenefits) {
            // Transfer ownership
            await this.transferOwnership(agreementId);
            return {
              status: "transferred",
              daysOverdue,
              action: "Ownership transferred to platform",
            };
          } else if (daysOverdue >= 90 && agreement.seasonalMemberBenefits) {
            // Transfer ownership for seasonal members
            await this.transferOwnership(agreementId);
            return {
              status: "transferred",
              daysOverdue,
              action:
                "Ownership transferred to platform (seasonal member terms)",
            };
          } else {
            // Apply penalties
            await this.applyPenalties(agreementId, sale, daysOverdue);
            return {
              status: "overdue",
              daysOverdue,
              action: `Penalties applied, ${60 - daysOverdue} days until transfer`,
            };
          }
        }
      }
    }

    return {
      status: "current",
      daysOverdue: 0,
      action: "No action required",
    };
  }

  /**
   * Transfer item ownership to platform
   */
  private async transferOwnership(agreementId: string): Promise<void> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return;

    // Update agreement status
    agreement.status = "transferred";
    agreement.endDate = new Date().toISOString();

    // Copy sourcing information to platform ownership
    const platformOwnership = {
      itemId: agreement.itemId,
      originalOwner: agreement.userId,
      transferDate: new Date().toISOString(),
      transferReason: "Payment default",
      sourcingInfo: { ...agreement.sourcingInfo },
      marketValue: agreement.sourcingInfo.marketValue,
      contractHash: agreement.contractHash,
    };

    // Save platform ownership record
    localStorage.setItem(
      `platformOwnership_${agreement.itemId}`,
      JSON.stringify(platformOwnership),
    );

    this.agreements.set(agreementId, agreement);
    this.saveAgreements();

    console.log(
      `🏛️ Ownership transferred: ${agreement.itemName} from user ${agreement.userId}`,
    );
  }

  /**
   * Apply penalties for overdue payments
   */
  private async applyPenalties(
    agreementId: string,
    sale: SaleRecord,
    daysOverdue: number,
  ): Promise<void> {
    const agreement = this.agreements.get(agreementId);
    if (!agreement) return;

    const contract = Array.from(this.contracts.values()).find((c) =>
      agreement.contractTerms.includes(c.name),
    );

    if (!contract) return;

    // Calculate penalty
    const weeksOverdue = Math.ceil(daysOverdue / 7);
    const penaltyAmount = sale.paybackDue * contract.penaltyRate * weeksOverdue;

    // Update sale record
    sale.paybackDue += penaltyAmount;
    sale.status = "overdue";

    this.agreements.set(agreementId, agreement);
    this.saveAgreements();

    console.log(
      `⚠️ Penalty applied: $${penaltyAmount} for ${daysOverdue} days overdue`,
    );
  }

  /**
   * Use AI Reserve Pool to cover payment differences
   */
  async useAIReserveForPaymentDifference(
    userId: string,
    amount: number,
    reason: string,
  ): Promise<boolean> {
    if (this.aiReservePool.totalAmount >= amount) {
      // Disburse from reserve
      this.aiReservePool.totalAmount -= amount;
      this.aiReservePool.disbursements.push({
        userId,
        amount,
        reason,
        date: new Date().toISOString(),
      });

      this.saveAIReservePool();

      console.log(
        `🤖 AI Reserve disbursement: $${amount} to user ${userId} for ${reason}`,
      );
      return true;
    }

    return false;
  }

  /**
   * Set user resale preferences
   */
  async setUserResalePreferences(
    userId: string,
    preferences: {
      allowedCategories: string[];
      autoRelist: boolean;
      priceStrategy: "market" | "fixed" | "ai_optimized";
      paybackPercentage: number;
      seasonalMemberOptIn: boolean;
    },
  ): Promise<void> {
    const userPrefs = {
      userId,
      ...preferences,
      lastUpdated: new Date().toISOString(),
    };

    localStorage.setItem(
      `resalePreferences_${userId}`,
      JSON.stringify(userPrefs),
    );

    console.log(`⚙️ Resale preferences updated for user ${userId}`);
  }

  /**
   * Get user agreements
   */
  getUserAgreements(userId: string): PaybackAgreement[] {
    return Array.from(this.agreements.values()).filter(
      (agreement) => agreement.userId === userId,
    );
  }

  /**
   * Get AI Reserve Pool status
   */
  getAIReservePoolStatus(): AIReservePool {
    return { ...this.aiReservePool };
  }

  /**
   * Check seasonal membership
   */
  private async checkSeasonalMembership(userId: string): Promise<boolean> {
    try {
      const userData = localStorage.getItem(`userData_${userId}`);
      if (userData) {
        const user = JSON.parse(userData);
        return (
          user.membershipLevel === "member" ||
          user.membershipLevel === "premium"
        );
      }
    } catch (error) {
      console.error("Error checking seasonal membership:", error);
    }
    return false;
  }

  /**
   * Generate contract hash for security
   */
  private async generateContractHash(
    contractTerms: string,
    userId: string,
    itemId: string,
  ): Promise<string> {
    const hashInput = `${contractTerms}${userId}${itemId}${Date.now()}`;
    // Simple hash for demo - in production would use crypto
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Start payment monitoring
   */
  private startPaymentMonitoring(): void {
    // Check payments every hour
    setInterval(async () => {
      await this.checkAllPayments();
    }, 3600000);
  }

  /**
   * Check all payments
   */
  private async checkAllPayments(): Promise<void> {
    for (const agreementId of this.agreements.keys()) {
      try {
        await this.checkPaymentStatus(agreementId);
      } catch (error) {
        console.error(`Error checking payment for ${agreementId}:`, error);
      }
    }
  }

  /**
   * Storage methods
   */
  private saveAgreements(): void {
    try {
      const data = Array.from(this.agreements.entries());
      localStorage.setItem("paybackAgreements", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving agreements:", error);
    }
  }

  private saveAIReservePool(): void {
    try {
      localStorage.setItem("aiReservePool", JSON.stringify(this.aiReservePool));
    } catch (error) {
      console.error("Error saving AI reserve pool:", error);
    }
  }

  private loadSavedData(): void {
    try {
      // Load agreements
      const savedAgreements = localStorage.getItem("paybackAgreements");
      if (savedAgreements) {
        const data = JSON.parse(savedAgreements);
        this.agreements = new Map(data);
      }

      // Load AI reserve pool
      const savedReserve = localStorage.getItem("aiReservePool");
      if (savedReserve) {
        this.aiReservePool = JSON.parse(savedReserve);
      }
    } catch (error) {
      console.error("Error loading saved data:", error);
    }
  }
}

// Export singleton instance
export const SalesSharePaybackService = new SalesSharePaybackServiceClass();
export default SalesSharePaybackService;
