/**
 * ==========================================================
 * Model : RecentLeadResponse
 *
 * Description:
 * Represents a recently created or recently updated lead
 * displayed on the dashboard.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Recent Leads section
 * ==========================================================
 */

export interface RecentLeadResponse {

  /**
   * Unique identifier of the lead.
   */
  leadId: number;

  /**
   * Name of the customer/lead.
   */
  leadName: string;

  /**
   * Current status of the lead.
   *
   * Example:
   * NEW
   * CONTACTED
   * QUALIFIED
   * FOLLOW_UP
   * PROPOSAL_SENT
   * NEGOTIATION
   * WON
   * LOST
   * CLOSED
   */
  status: string;

  /**
   * Current priority of the lead.
   *
   * Example:
   * HOT
   * WARM
   * COLD
   * NOT_A_CUSTOMER
   */
  priority: string;

  /**
   * Name of the executive assigned to the lead.
   */
  assignedExecutive: string;

  /**
   * Date and time when the lead was created.
   */
  createdAt: string;

}