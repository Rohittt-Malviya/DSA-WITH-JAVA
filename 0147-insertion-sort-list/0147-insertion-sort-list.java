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
    public ListNode insertionSortList(ListNode head) {
ListNode f=head;
        ListNode s=head;
        if(head==null||head.next==null)return head;
         
        while(f.next!=null && f.next.next!=null){
            s=s.next;
            f=f.next.next;
        }
         ListNode te=s.next;
        s.next=null;
        head=insertionSortList(head);
        te=insertionSortList(te);
        return merge(head,te);
    }
    static ListNode merge(ListNode h1,ListNode h2){
        ListNode temp=new ListNode(-1);
        ListNode k=temp;
        while(h1!=null && h2!=null){
            if(h1.val>h2.val){
                k.next=h2;
                h2=h2.next;
            }else{
                k.next=h1;
                h1=h1.next;
            }
            k=k.next;
            
        }
        if(h1==null)k.next=h2;
            else k.next=h1;
            return temp.next;
    
    }
}