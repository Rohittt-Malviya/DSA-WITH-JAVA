/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public int pairSum(ListNode head) {
        ListNode temp=head;
        int count=0;
        while(temp!=null){
            count++;
            temp=temp.next;
        }
        int[] l=new int[count/2];
        int n=(count/2)-1;
        ListNode f=head;
        for(int i=1;i<=n;i++){
            f=f.next;
        }
        ListNode head2=f.next;
        f.next=null;
        head2=reverse(head2);
        ListNode i=head;
        ListNode j=head2;
        int idx=0;
        while(j!=null){
            int w=i.val+j.val;
             l[idx]=w;
             idx++;
             i=i.next;
             j=j.next;
        }
        int max=0;
        for(int g:l){
            if(max<g){
                max=g;
            }
        }
        return max;
    }public ListNode reverse(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    ListNode fwd;
    
    while (current != null) {
        fwd = current.next;      // Save next node
        current.next = prev;      // Reverse the link
        prev = current;           // Move prev forward
        current = fwd;           // Move current forward
    }
   
    
    return prev;  // New head of reversed list
}
}