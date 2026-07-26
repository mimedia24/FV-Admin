import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DollarOutlined,
  EditOutlined,
  KeyOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import axiosInstance from "../../services/axios/axiosInstance";

const { Text, Title } = Typography;
const PHONE_PATTERN = /^01\d{9}$/;

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

function ZoneAgentChargeDirectory({ zones, loading, onRefresh }) {
  const [agentForm] = Form.useForm();
  const [chargeForm] = Form.useForm();
  const [selectedZone, setSelectedZone] = useState(null);
  const [agentOpen, setAgentOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fallbackCharge, setFallbackCharge] = useState(null);

  useEffect(() => {
    const fetchFallback = async () => {
      try {
        const { data } = await axiosInstance.get("/charges/schedule");
        const plans = Array.isArray(data?.charges) ? data.charges : [];
        setFallbackCharge(
          plans.find((item) => item?.isActive) || plans[0] || null
        );
      } catch {
        setFallbackCharge(null);
      }
    };
    fetchFallback();
  }, []);

  const stats = useMemo(() => {
    const agents = zones.filter((zone) => zone?.manager);
    const configuredCharges = zones.filter((zone) => zone?.deliveryCharge);
    return {
      agents: agents.length,
      activeAgents: agents.filter((zone) => zone.manager?.isActive !== false)
        .length,
      configuredCharges: configuredCharges.length,
    };
  }, [zones]);

  const openAgent = (zone) => {
    const manager = zone?.manager || {};
    setSelectedZone(zone);
    agentForm.setFieldsValue({
      agentName: manager.agentName || manager.name || zone.name,
      managerName: manager.managerName || manager.name || "",
      phoneNumber: manager.phoneNumber || "",
      email: manager.email || "",
      address: manager.address || "",
      isActive: manager.isActive !== false,
      password: "",
    });
    setAgentOpen(true);
  };

  const openCharge = (zone) => {
    const charge = zone?.deliveryCharge || fallbackCharge || {};
    setSelectedZone(zone);
    chargeForm.setFieldsValue({
      riderFirstKMCharge: Number(charge.riderFirstKMCharge || 0),
      riderOthersKMCharge: Number(charge.riderOthersKMCharge || 0),
      userFirstKMCharge: Number(charge.userFirstKMCharge || 0),
      userOthersKMCharge: Number(charge.userOthersKMCharge || 0),
      isActive: zone?.deliveryCharge
        ? zone.deliveryCharge.isActive !== false
        : true,
    });
    setChargeOpen(true);
  };

  const saveAgent = async (values) => {
    if (!selectedZone?.id) return;
    const manager = selectedZone.manager;
    if (!manager?._id && !values.password) {
      message.error("A password is required when creating a Zone Agent.");
      return;
    }

    setSaving(true);
    try {
      const profile = {
        agentName: values.agentName,
        managerName: values.managerName,
        phoneNumber: values.phoneNumber,
        email: values.email || "",
        address: values.address || "",
        zoneId: Number(selectedZone.id),
        isActive: Boolean(values.isActive),
      };

      if (manager?._id) {
        const { data } = await axiosInstance.patch(
          `/v3/master-admin/agents/${manager._id}`,
          profile
        );
        if (values.password) {
          await axiosInstance.put(
            `/v3/master-admin/agents/${manager._id}/password`,
            { password: values.password }
          );
        }
        message.success(
          data?.sessionInvalidated
            ? "Agent updated. Existing Agent sessions were signed out."
            : "Agent information updated."
        );
      } else {
        await axiosInstance.post("/v3/master-admin/register-zone-manager", {
          ...profile,
          password: values.password,
        });
        message.success("Agent account assigned to this zone.");
      }

      setAgentOpen(false);
      setSelectedZone(null);
      agentForm.resetFields();
      await onRefresh();
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to save Zone Agent."));
    } finally {
      setSaving(false);
    }
  };

  const saveCharge = async (values) => {
    if (!selectedZone?.id) return;
    setSaving(true);
    try {
      await axiosInstance.put(
        `/v3/master-admin/zone-charges/${selectedZone.id}`,
        {
          riderFirstKMCharge: Number(values.riderFirstKMCharge),
          riderOthersKMCharge: Number(values.riderOthersKMCharge),
          userFirstKMCharge: Number(values.userFirstKMCharge),
          userOthersKMCharge: Number(values.userOthersKMCharge),
          isActive: Boolean(values.isActive),
        }
      );
      message.success(`${selectedZone.name} delivery charge saved.`);
      setChargeOpen(false);
      setSelectedZone(null);
      chargeForm.resetFields();
      await onRefresh();
    } catch (error) {
      message.error(getErrorMessage(error, "Failed to save delivery charge."));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "Zone",
      width: 190,
      render: (_, zone) => (
        <div>
          <Text strong>{zone.name}</Text>
          <div className="text-xs text-slate-400">Zone #{zone.id}</div>
        </div>
      ),
    },
    {
      title: "Available Agent",
      width: 250,
      render: (_, zone) =>
        zone.manager ? (
          <div>
            <Text strong>
              {zone.manager.agentName || zone.manager.name || "Unnamed Agent"}
            </Text>
            <div className="text-xs text-slate-500">
              Manager:{" "}
              {zone.manager.managerName || zone.manager.name || "Not set"}
            </div>
            <div className="text-xs text-slate-400">
              {zone.manager.phoneNumber || "No login mobile"}
            </div>
          </div>
        ) : (
          <Tag color="warning">NO AGENT ASSIGNED</Tag>
        ),
    },
    {
      title: "Agent Status",
      width: 130,
      render: (_, zone) => (
        <Tag
          color={
            zone.manager && zone.manager.isActive !== false
              ? "success"
              : "default"
          }
        >
          {zone.manager
            ? zone.manager.isActive !== false
              ? "ACTIVE"
              : "INACTIVE"
            : "NOT SET"}
        </Tag>
      ),
    },
    {
      title: "User Delivery Charge",
      width: 200,
      render: (_, zone) => {
        const charge = zone.deliveryCharge || fallbackCharge;
        return (
          <div>
            <Text strong>
              First KM: BDT {Number(charge?.userFirstKMCharge || 0)}
            </Text>
            <div className="text-xs text-slate-500">
              Extra KM: BDT {Number(charge?.userOthersKMCharge || 0)}
            </div>
            <Tag
              className="mt-1"
              color={zone.deliveryCharge?.isActive ? "blue" : "default"}
            >
              {zone.deliveryCharge?.isActive
                ? "ZONE RATE"
                : "GLOBAL FALLBACK"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Rider Earning Rate",
      width: 180,
      render: (_, zone) => {
        const charge = zone.deliveryCharge || fallbackCharge;
        return (
          <div>
            <Text strong>
              First KM: BDT {Number(charge?.riderFirstKMCharge || 0)}
            </Text>
            <div className="text-xs text-slate-500">
              Extra KM: BDT {Number(charge?.riderOthersKMCharge || 0)}
            </div>
          </div>
        );
      },
    },
    {
      title: "Management",
      fixed: "right",
      width: 225,
      render: (_, zone) => (
        <Space wrap>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => openAgent(zone)}
          >
            {zone.manager ? "Agent" : "Assign Agent"}
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<DollarOutlined />}
            onClick={() => openCharge(zone)}
          >
            Charge
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <section className="mt-8 overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-white to-cyan-50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-600">
              <SafetyCertificateOutlined />
              Main Admin Authority
            </div>
            <Title level={3} className="!m-0">
              Zone Agent & Delivery Charge
            </Title>
            <Text type="secondary">
              Manage each Zone Agent and its delivery rate from this existing
              Zone Management page. Delivery charges are editable only by Main
              Admin.
            </Text>
          </div>
          <Space wrap>
            <Tag color="blue">Agents: {stats.agents}</Tag>
            <Tag color="success">Active: {stats.activeAgents}</Tag>
            <Tag color="purple">
              Zone Rates: {stats.configuredCharges}
            </Tag>
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={zones}
          rowKey={(zone) => String(zone.id)}
          loading={loading}
          scroll={{ x: 1180 }}
          pagination={{ pageSize: 10 }}
          locale={{
            emptyText: <Empty description="No service zone found" />,
          }}
        />
      </section>

      <Modal
        title={
          <Space>
            <TeamOutlined />
            {selectedZone?.manager ? "Update Zone Agent" : "Assign Zone Agent"}
          </Space>
        }
        open={agentOpen}
        onCancel={() => setAgentOpen(false)}
        footer={null}
        destroyOnClose
        width={680}
      >
        <div className="mb-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-700">
          Zone #{selectedZone?.id}: {selectedZone?.name}
        </div>
        <Form form={agentForm} layout="vertical" onFinish={saveAgent}>
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item
              name="agentName"
              label="Agent / Business Name"
              rules={[{ required: true, message: "Agent name is required." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="managerName"
              label="Manager Name"
              rules={[{ required: true, message: "Manager name is required." }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Login Mobile"
              rules={[
                { required: true, message: "Login mobile is required." },
                {
                  pattern: PHONE_PATTERN,
                  message: "Use an 11-digit Bangladesh mobile number.",
                },
              ]}
            >
              <Input maxLength={11} />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input type="email" />
            </Form.Item>
          </div>
          <Form.Item name="address" label="Address">
            <Input.TextArea rows={2} />
          </Form.Item>
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            <Form.Item
              name="password"
              label={
                <Space>
                  <KeyOutlined />
                  {selectedZone?.manager
                    ? "New Password (optional)"
                    : "Login Password"}
                </Space>
              }
              rules={[
                {
                  min: 6,
                  message: "Password must be at least 6 characters.",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Agent Access"
              valuePropName="checked"
            >
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setAgentOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save Agent
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <Space>
            <DollarOutlined />
            Zone Delivery Charge
          </Space>
        }
        open={chargeOpen}
        onCancel={() => setChargeOpen(false)}
        footer={null}
        destroyOnClose
        width={620}
      >
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          Main Admin-only setting for Zone #{selectedZone?.id}:{" "}
          {selectedZone?.name}
        </div>
        <Form form={chargeForm} layout="vertical" onFinish={saveCharge}>
          <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
            {[
              ["userFirstKMCharge", "User First KM"],
              ["userOthersKMCharge", "User Extra KM"],
              ["riderFirstKMCharge", "Rider First KM"],
              ["riderOthersKMCharge", "Rider Extra KM"],
            ].map(([name, label]) => (
              <Form.Item
                key={name}
                name={name}
                label={label}
                rules={[
                  { required: true, message: `${label} is required.` },
                  {
                    type: "number",
                    min: 0,
                    message: "Charge cannot be negative.",
                  },
                ]}
              >
                <InputNumber min={0} precision={2} className="!w-full" />
              </Form.Item>
            ))}
          </div>
          <Form.Item
            name="isActive"
            label="Use this Zone rate"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Fallback" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setChargeOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>
              Save Delivery Charge
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default ZoneAgentChargeDirectory;
