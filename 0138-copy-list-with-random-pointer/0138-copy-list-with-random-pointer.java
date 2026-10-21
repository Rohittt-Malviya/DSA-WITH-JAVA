/*
// Definition for a Node.
class Node {
    int val;
    Node next;
    Node random;

    public Node(int val) {
        this.val = val;
        this.next = null;
        this.random = null;
    }
}
*/

class Solution {
    public Node copyRandomList(Node head) {
        Node head2=copy(head);

        merge( head, head2);
        random( head, head2);
        split( head);
        return head2;
    }
    public void random(Node head,Node head2){
        Node t1=head;
        Node t2=head2;
        while(t1!=null && t2!=null){
            if(t1.random==null)t2.random=null;
            else t2.random=t1.random.next;
            t1=t1.next.next;
            if(t2.next!=null)t2=t2.next.next;
        }
    }
    public void split(Node head){
        Node t=head;
        Node dummy1=new Node(-1);
        Node dummy2=new Node(-1);
        Node t1=dummy1;
        Node t2=dummy2;
        while(t!=null){
            t1.next=t;
            t=t.next;
            t1=t1.next;
            
            t2.next=t;
            t=t.next;
            t2=t2.next;
        }t1.next=null;
       // t2.next=null;
    }
    public void merge(Node head,Node head2){
        Node dummy=new Node(-1);
        Node d=dummy;
        Node t1=head;
        Node t2=head2;
        while(t2!=null && t1!=null){
        d.next=t1;
        d=d.next;
        t1=t1.next;

        d.next=t2;
        d=d.next;
        
        t2=t2.next;
        }dummy=dummy.next;
    }
    public Node copy(Node head2){
        Node dummy=new Node(-1);
        Node t=dummy;
        Node h=head2;
        while(h!=null){
            Node t1=new Node(h.val);
            t.next=t1;
            h=h.next;
            t=t.next;
        }return dummy.next;
    }
}