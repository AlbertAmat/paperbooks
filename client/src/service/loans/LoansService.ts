import {PATH_PREFIX} from "@/Constants";
import axiosInstance from "@/plugins/axiosInstance";
import ILoansResponse from "@/types/loans/ILoan";

/**
 * Thin HTTP client for the `/api/rest/loans` endpoint (see server/src/routes/LoansRoute.ts).
 *
 * @example
 * const {loans, total} = await loansService.getLoans(0, null, null, null);
 */
class LoansService {

    /**
     * Paginated, filterable list of books currently on loan.
     * @param page Zero-based page index (50 results per page).
     * @param groupId Restrict to customers in this group, or null for all.
     * @param dateFrom Only loans made on/after this date ("YYYY-MM-DD"), or null.
     * @param dateTo Only loans made on/before this date ("YYYY-MM-DD"), or null.
     * @returns A page of matching loans plus pagination info.
     */
    public async getLoans(
        page: number,
        groupId: number | null,
        dateFrom: string | null,
        dateTo: string | null
    ): Promise<ILoansResponse> {
        const {data} = await axiosInstance.get(`${PATH_PREFIX}/loans`, {
            params: {
                page: page,
                group_id: groupId,
                date_from: dateFrom,
                date_to: dateTo
            }
        });

        return data;
    }
}

/** Singleton instance shared by every part of the app. */
export const loansService = new LoansService();
