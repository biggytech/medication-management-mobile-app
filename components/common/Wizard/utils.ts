/**
 * Checks if a submission is currently in progress
 * @param isSubmitting - Current submission state
 * @returns true if submission is in progress, false otherwise
 */
export const isSubmissionInProgress = (isSubmitting: boolean): boolean => {
  return isSubmitting;
};
/**
 * Debounces submission to prevent rapid double clicks
 * Manages submission state and ensures proper cleanup
 * @param submissionFn - Function to execute for submission
 * @param setIsSubmitting - State setter for submission status
 * @returns Promise that resolves when submission is complete
 */
export const debounceSubmission = async (
  submissionFn: () => void | Promise<void>,
  setIsSubmitting: (value: boolean) => void,
): Promise<void> => {
  try {
    setIsSubmitting(true);
    await submissionFn();
  } catch (error) {
    // Re-throw error to be handled by parent component
    throw error;
  } finally {
    // Always reset submission state, even if error occurs
    setIsSubmitting(false);
  }
};
