/**
 * ==========================================================
 * MODEL : LeadSourceChartResponse
 *
 * Description :
 * Represents lead count information for a particular
 * lead source.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * ==========================================================
 */

export interface LeadSourceChartResponse {

  /**
   * Source from which the lead was generated.
   *
   * Examples:
   * WEBSITE
   * REFERRAL
   * SOCIAL_MEDIA
   * EMAIL
   * PHONE
   * WALK_IN
   */
  source: string;

  /**
   * Number of leads generated from this source.
   */
  count: number;

}