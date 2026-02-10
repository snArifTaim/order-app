/**
 * Formats a number as a price string with currency symbol
 * @param price - The price to format
 * @returns Formatted price string (e.g., "$12.99")
 */
export const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) {
        return "$0.00";
    }
    return `$${price.toFixed(2)}`;
};
