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
    public ListNode reverseBetween(ListNode head, int left, int right) {
        ListNode l=head;
        ListNode r;
        ListNode list1=new ListNode(-1);
        ListNode l1=list1;
        list1.next=head;
        if (head == null || left == right) return head;

        for(int i=1;i<left;i++){
            l1.next=l;
            l1=l1.next;
            l=l.next;

        }
        ListNode li1=l;
        ListNode h1=li1;
        //l.next=null;
        for(int i=left;i<right;i++){
          if(h1==null)return head;
             h1=h1.next;
        }
        ListNode list3=h1.next;
        //ListNode l3=list3;
        h1.next=null;
        //h1=reverse(h1);
        l1.next=reverse(li1);
        li1.next=list3;
        return list1.next;
    }
     public ListNode reverse(ListNode h1){
        ListNode prev=null;
        ListNode curr=h1;
        ListNode fwd=null;
        while(curr!=null){
            fwd=curr.next;
            curr.next=prev;
            prev=curr;
            curr=fwd;

        }
        return prev;
    }
}