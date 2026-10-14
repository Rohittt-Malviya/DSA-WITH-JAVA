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
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode i=list1;
        ListNode j=list2;
        ListNode temp=new ListNode(-1);
        ListNode k=temp;
        //if(i==null && j== null)return list1;
        while(i!=null && j!=null){
            if(i.val>=j.val){
                k.next=j;
                j=j.next;
            }else if(i.val<=j.val){
                k.next=i;
                i=i.next;
            }
            k=k.next;

        }if(i==null)k.next=j;
        else k.next=i;
        return temp.next;
    }
}