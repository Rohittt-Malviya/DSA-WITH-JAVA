package search;

public class min2D {
    static void main(String[] args) {
        int [][] arr={
                {1,2,3,4},
                {5,78,96,47,55,66},
                {11,22,33,5},
                {58,74,-111113}
        };
        int target=74;
        int ans=search (arr);
        System.out.print(ans);
    }
    static int search(int[][] arr){
        int min=Integer.MAX_VALUE;
        for(int row=0;row<arr.length;row++){
            for(int col=0;col<arr[row].length;col++){
                if(arr[row][col]<min){
                    min=arr[row][col];
                }
            }
        }
        return min;
    }
}
