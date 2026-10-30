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
    public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
        ListNode s=list1;
        ListNode f=list1;
        for(int i=1;i<=a-1;i++){
            s=s.next;
        }for(int i=1;i<=b;i++){
            f=f.next;
        }
       // s=s.next;
      //  f=f.next;
        ListNode u=f.next;
        ListNode t2=list2;
        while(t2!=null){
            s.next=t2;
            t2=t2.next;
            s=s.next;
        }
        //s=s.next;
        s.next=u;
        return list1;

        
    }
}