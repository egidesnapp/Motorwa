import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { router, Stack } from 'expo-router';
import { Colors, FontSizes, BorderRadius } from '@/constants/theme';
import { ArrowLeft, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react-native';
import apiClient from '@/lib/api';

interface Payment {
  id: string;
  type: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  createdAt: string;
  listing?: { title: string };
  subscription?: { name: string };
}

interface Subscription {
  id: string;
  plan: string;
  price: number;
  status: 'ACTIVE' | 'EXPIRED';
  expiresAt: string;
}

export default function PaymentsScreen() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, subRes] = await Promise.all([
        apiClient.get('/api/v1/payments/history'),
        apiClient.get('/api/v1/dealers/subscription'),
      ]);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.data);
      if (subRes.data.success) setSubscription(subRes.data.data);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    { id: 'basic', name: 'Basic', price: '50,000 RWF/mo', features: ['5 listings', 'Standard support'] },
    { id: 'dealer', name: 'Dealer', price: '150,000 RWF/mo', features: ['50 listings', 'Dealer badge', 'Priority support'] },
    { id: 'premium', name: 'Premium Dealer', price: '300,000 RWF/mo', features: ['Unlimited listings', 'Premium badge', 'Boosted visibility', 'Dedicated support'] },
  ];

  const formatAmount = (amount: number) => `${Number(amount).toLocaleString()} RWF`;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle size={16} color={Colors.green} />;
      case 'PENDING': return <Clock size={16} color={Colors.gold} />;
      case 'FAILED': return <XCircle size={16} color={Colors.accent} />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.navy} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Current Subscription */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Subscription</Text>
          <View style={styles.subscriptionCard}>
            {subscription?.status === 'ACTIVE' ? (
              <>
                <View style={styles.subHeader}>
                  <View style={[styles.subBadge, { backgroundColor: Colors.goldPale }]}>
                    <Zap size={14} color={Colors.gold} />
                    <Text style={[styles.subBadgeText, { color: Colors.gold }]}>{subscription.plan}</Text>
                  </View>
                  <Text style={styles.subStatus}>Active</Text>
                </View>
                <Text style={styles.subExpires}>Expires: {new Date(subscription.expiresAt).toLocaleDateString()}</Text>
              </>
            ) : (
              <View style={styles.subHeader}>
                <Text style={styles.subStatus}>No active subscription</Text>
              </View>
            )}
          </View>
        </View>

        {/* Upgrade Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upgrade Plan</Text>
          {plans.map((plan) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
              </View>
              {plan.features.map((feature, i) => (
                <View key={i} style={styles.planFeature}>
                  <CheckCircle size={14} color={Colors.green} />
                  <Text style={styles.planFeatureText}>{feature}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.planButton}>
                <Text style={styles.planButtonText}>Subscribe</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {payments.length === 0 ? (
            <View style={styles.emptyCard}>
              <CreditCard size={32} color={Colors.gray300} />
              <Text style={styles.emptyText}>No payments yet</Text>
            </View>
          ) : (
            payments.map((payment) => (
              <View key={payment.id} style={styles.paymentCard}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentType}>
                    {getStatusIcon(payment.status)}
                    <Text style={styles.paymentLabel}>{payment.type}</Text>
                  </View>
                  <Text style={styles.paymentAmount}>{formatAmount(payment.amount)}</Text>
                </View>
                {payment.listing?.title && (
                  <Text style={styles.paymentDesc}>{payment.listing.title}</Text>
                )}
                <Text style={styles.paymentDate}>{new Date(payment.createdAt).toLocaleDateString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.gray200 },
  headerTitle: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  section: { paddingHorizontal: 16, marginTop: 24 },
  sectionTitle: { fontSize: FontSizes.sm, fontWeight: '600', color: Colors.gray400, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  subscriptionCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200 },
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  subBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.md },
  subBadgeText: { fontSize: FontSizes.base, fontWeight: '600' },
  subStatus: { fontSize: FontSizes.sm, color: Colors.gray600 },
  subExpires: { fontSize: FontSizes.sm, color: Colors.gray400 },
  planCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 12 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  planName: { fontSize: FontSizes.lg, fontWeight: '600', color: Colors.gray900 },
  planPrice: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gold },
  planFeature: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  planFeatureText: { fontSize: FontSizes.sm, color: Colors.gray600 },
  planButton: { backgroundColor: Colors.gold, borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
  planButtonText: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.navy },
  paymentCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 16, borderWidth: 1, borderColor: Colors.gray200, marginBottom: 8 },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  paymentType: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  paymentLabel: { fontSize: FontSizes.base, fontWeight: '600', color: Colors.gray900 },
  paymentAmount: { fontSize: FontSizes.base, fontWeight: 'bold', color: Colors.gold },
  paymentDesc: { fontSize: FontSizes.sm, color: Colors.gray600, marginBottom: 4 },
  paymentDate: { fontSize: FontSizes.xs, color: Colors.gray400 },
  emptyCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.lg, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: Colors.gray200 },
  emptyText: { fontSize: FontSizes.base, color: Colors.gray400, marginTop: 8 },
});
