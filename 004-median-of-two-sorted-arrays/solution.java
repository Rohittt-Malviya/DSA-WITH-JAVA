class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int m=nums1.length;
        int n=nums2.length;
        int[] a=new int[m+n];
        for(int i=0;i<m;i++){
            a[i]=nums1[i];
        }
        for(int i=0;i<n;i++){
            a[m+i]=nums2[i];
        }
        Arrays.sort(a);
        
        int e=a.length;
        int mid=e/2;
        if(a.length%2==0){
            return (a[mid]+a[mid-1])/2.0;
        }
        return a[mid];
            
        


    }
}
