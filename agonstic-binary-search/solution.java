public class agnosticbinarysearch {
    public static void main(String[] args) {
        int[] arr = {-1,0,1,2,5,6,7,8,9,10,15,18,19,20,24,25,26};
        int target = 5;
        int ans = agbs(arr, target);
        System.out.print(ans);
    }

    static int agbs(int[] arr, int target) {
        int start = 0;
        int end = arr.length - 1;

        boolean isAsc = arr[start] < arr[end];

        while (start <= end) {
            int mid = start + (end - start) / 2;

            if (arr[mid] == target) {
                return mid;
            }

            if (isAsc) {

                if (target > arr[mid]) {
                    start = mid + 1;
                } else {
                    end = mid - 1;
                }
            } else {

                if (target < arr[mid]) {
                    start = mid + 1;
                } else {
                    end = mid - 1;
                }
            }
        }
        return -1;
    }
}
