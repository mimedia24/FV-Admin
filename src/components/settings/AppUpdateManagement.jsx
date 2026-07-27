import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  Spin,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { RefreshCw, Save, Smartphone } from "lucide-react";
import axiosInstance from "../../services/axios/axiosInstance";

const APP_TYPES = [
  { value: "USER_APP", label: "User App" },
  { value: "RESTAURANT_APP", label: "Restaurant App" },
  { value: "RIDER_APP", label: "Rider App" },
];

const PLATFORMS = [
  { value: "ANDROID", label: "Android" },
  { value: "IOS", label: "iOS" },
];

const defaultConfig = (appType = "USER_APP", platform = "ANDROID") => ({
  appType,
  platform,
  latestVersionCode: 1,
  latestVersionName: "1.0.0",
  minimumSupportedVersionCode: 1,
  softReminderEnabled: true,
  forceUpdateEnabled: false,
  updateTitle: "New update available",
  updateMessage: "Update the app to get the latest improvements.",
  updateUrl: "",
  isActive: true,
});

const configKey = (value) => `${value?.appType}:${value?.platform}`;

export default function AppUpdateManagement() {
  const [form] = Form.useForm();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const selectedAppType = Form.useWatch("appType", form) || "USER_APP";
  const selectedPlatform = Form.useWatch("platform", form) || "ANDROID";

  const configMap = useMemo(
    () => new Map(configs.map((config) => [configKey(config), config])),
    [configs],
  );

  const loadConfigs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        "/v3/master-admin/app-update",
      );
      setConfigs(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      setConfigs([]);
      message.error(
        error?.response?.data?.message ||
          "Failed to load app update configuration.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const applySelectedConfig = useCallback(
    (appType, platform) => {
      const saved = configMap.get(`${appType}:${platform}`);
      form.setFieldsValue(saved || defaultConfig(appType, platform));
    },
    [configMap, form],
  );

  useEffect(() => {
    if (!loading) {
      applySelectedConfig(selectedAppType, selectedPlatform);
    }
  }, [
    applySelectedConfig,
    loading,
    selectedAppType,
    selectedPlatform,
  ]);

  const saveConfig = async (values) => {
    if (
      Number(values.minimumSupportedVersionCode) >
      Number(values.latestVersionCode)
    ) {
      message.error("Minimum supported build cannot exceed latest build.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...values,
        latestVersionCode: Number(values.latestVersionCode),
        minimumSupportedVersionCode: Number(
          values.minimumSupportedVersionCode,
        ),
      };
      const { data } = await axiosInstance.put(
        "/v3/master-admin/app-update",
        payload,
      );
      message.success(data?.message || "App update configuration saved.");
      await loadConfigs();
    } catch (error) {
      message.error(
        error?.response?.data?.message ||
          "Failed to save app update configuration.",
      );
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    {
      title: "App",
      dataIndex: "appType",
      render: (value) =>
        APP_TYPES.find((item) => item.value === value)?.label || value,
    },
    { title: "Platform", dataIndex: "platform" },
    {
      title: "Latest",
      render: (_, row) => (
        <span>
          {row.latestVersionName} ({row.latestVersionCode})
        </span>
      ),
    },
    {
      title: "Minimum build",
      dataIndex: "minimumSupportedVersionCode",
    },
    {
      title: "Reminder",
      dataIndex: "softReminderEnabled",
      render: (value) => (
        <Tag color={value ? "blue" : "default"}>
          {value ? "Daily" : "Off"}
        </Tag>
      ),
    },
    {
      title: "Force",
      dataIndex: "forceUpdateEnabled",
      render: (value) => (
        <Tag color={value ? "red" : "green"}>
          {value ? "Required" : "Optional"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (value) => (
        <Tag color={value ? "green" : "default"}>
          {value ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (_, row) => (
        <Button
          size="small"
          onClick={() => {
            form.setFieldsValue(row);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                  <Smartphone size={21} />
                </span>
                <div>
                  <h2 className="text-xl font-black text-slate-950">
                    App Update Control
                  </h2>
                  <p className="text-sm text-slate-500">
                    Configure daily reminders and mandatory upgrades.
                  </p>
                </div>
              </div>
            </div>
            <Button
              icon={<RefreshCw size={15} />}
              onClick={loadConfigs}
              loading={loading}
            >
              Refresh
            </Button>
          </div>

          <Alert
            className="mt-5"
            type="info"
            showIcon
            message="Version rule"
            description="Builds below Latest receive the optional daily reminder. When Force Update is enabled, builds below Minimum Supported are blocked until updated."
          />

          <Form
            form={form}
            layout="vertical"
            className="mt-6"
            initialValues={defaultConfig()}
            onFinish={saveConfig}
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Form.Item name="appType" label="Application" required>
                <Select options={APP_TYPES} />
              </Form.Item>
              <Form.Item name="platform" label="Platform" required>
                <Select options={PLATFORMS} />
              </Form.Item>
              <Form.Item
                name="latestVersionCode"
                label="Latest version code"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} precision={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="latestVersionName"
                label="Latest version name"
                rules={[{ required: true }]}
              >
                <Input placeholder="Example: 2.5.0" />
              </Form.Item>
              <Form.Item
                name="minimumSupportedVersionCode"
                label="Minimum supported code"
                rules={[{ required: true }]}
              >
                <InputNumber min={1} precision={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="updateUrl"
                label="Store/update URL"
                rules={[
                  { required: true },
                  { type: "url", message: "Enter a valid update URL." },
                ]}
              >
                <Input placeholder="https://play.google.com/store/apps/..." />
              </Form.Item>
              <Form.Item
                name="updateTitle"
                label="Popup title"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="updateMessage"
                label="Popup message"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
              <Form.Item
                name="softReminderEnabled"
                label="Daily optional reminder"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="forceUpdateEnabled"
                label="Force update"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="isActive"
                label="Configuration active"
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                icon={<Save size={15} />}
                loading={saving}
              >
                Save update policy
              </Button>
            </div>
          </Form>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <Table
            rowKey={(row) => configKey(row)}
            dataSource={configs}
            columns={columns}
            pagination={false}
            scroll={{ x: 900 }}
          />
        </div>
      </div>
    </Spin>
  );
}
