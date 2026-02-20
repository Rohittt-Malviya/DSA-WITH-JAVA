package sorting;

import java.util.Arrays;

public class BubbleSort {
    static void main(String[] args) {
        int[] arr={5,8,-10,7,9};
        buble(arr);
        System.out.print(Arrays.toString(arr));

    }
    static void buble(int[] arr){
        boolean swap;
        for (int i = 0; i < arr.length; i++) {
            swap=false;
            for (int j = 1; j < arr.length-i ; j++) {
                if(arr[j]<arr[j-1]){
                    int temp=arr[j];
                    arr[j]=arr[j-1];
                    arr[j-1]=temp;
                    swap=true;
                }

            }if(swap==false){
                break;
            }

        }
    }
}
