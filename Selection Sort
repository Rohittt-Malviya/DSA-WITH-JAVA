package sorting;

import java.util.Arrays;

public class SelectionSort {
    static void main(String[] args) {
        int[] arr={4,7,8,9,5,4,2};
        selection(arr);
        System.out.print(Arrays.toString(arr));
    }
    static void selection(int[] arr){
        for (int i = 0; i <arr.length-1 ; i++) {
            int min=i;
            for (int j = i+1; j < arr.length ; j++) {
                if(arr[j]<arr[min]){
                    min=j;
                }

            }
            int temp=arr[i];
            arr[i]=arr[min];
            arr[min]=temp;

        }
    }
}
